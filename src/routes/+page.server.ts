import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import type { Database } from '$lib/supabase-types';
import { isBefore, startOfDay, parseISO, formatISO } from 'date-fns';

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export async function load({ locals: { session }, depends }) {
  depends('app:images');
  if (session?.user) {
    // Get user payment data and files in parallel
    let [{ data: paymentData }, { data: files }] = await Promise.all([
      supabaseAdmin.from('user_payments').select().eq('user_id', session.user.id).maybeSingle(),
      supabaseAdmin.storage.from('v2').list(`original/${session.user.id}`, {
        sortBy: { column: 'created_at', order: 'desc' }
      })
    ]);

    // If no payment record exists or if remaining generations is 0 and last update was before today,
    // create/update record with 1 free generation
    if (
      !paymentData ||
      (paymentData.remaining_generations === 0 &&
        (!paymentData.updated_at ||
          isBefore(parseISO(paymentData.updated_at), startOfDay(new Date()))))
    ) {
      if (!paymentData) {
        // Insert new record
        const { data: newPaymentData } = await supabaseAdmin
          .from('user_payments')
          .insert({
            user_id: session.user.id,
            remaining_generations: 1,
            updated_at: formatISO(new Date())
          })
          .select()
          .single();

        paymentData = newPaymentData;
      } else {
        // Update existing record
        const { data: updatedPaymentData } = await supabaseAdmin
          .from('user_payments')
          .update({
            remaining_generations: 1,
            updated_at: formatISO(new Date())
          })
          .eq('user_id', session.user.id)
          .select()
          .single();

        paymentData = updatedPaymentData;
      }
    }

    const images = files
      ? await Promise.all(
          files.map(async (file) => {
            const { data, error } = await supabaseAdmin.storage
              .from('v2')
              .createSignedUrl(`original/${session.user.id}/${file.name}`, 60);
            if (error) {
              throw error;
            }
            return {
              id: file.name,
              url: data.signedUrl
            };
          })
        )
      : [];

    return {
      remainingGenerations: paymentData?.remaining_generations || 0,
      images
    };
  }
  return {
    remainingGenerations: 0,
    images: []
  };
}
