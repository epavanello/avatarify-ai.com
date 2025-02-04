import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import type { Database } from '$lib/supabase-types';

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export async function load({ locals: { session }, depends }) {
  depends('app:images');
  if (session?.user) {
    // Get user payment data and files in parallel
    let [{ data: paymentData }, { data: files }] = await Promise.all([
      supabaseAdmin
        .from('user_payments')
        .select('remaining_generations')
        .eq('user_id', session.user.id)
        .maybeSingle(),
      supabaseAdmin.storage.from('v2').list(`original/${session.user.id}`, {
        sortBy: { column: 'created_at', order: 'desc' }
      })
    ]);

    // If no payment record exists, create one with 2 remaining generations
    if (!paymentData) {
      const { data: newPaymentData } = await supabaseAdmin
        .from('user_payments')
        .insert({
          user_id: session.user.id,
          remaining_generations: 2
        })
        .select('remaining_generations')
        .single();

      paymentData = newPaymentData;
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
