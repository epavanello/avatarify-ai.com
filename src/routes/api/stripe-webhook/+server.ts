import { error, json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase-types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import {
  PRIVATE_STRIPE_ENDPOINT_SECRET,
  PRIVATE_STRIPE_SECRET_KEY,
  PRIVATE_SUPABASE_SERVICE_ROLE
} from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const signature = request.headers.get('stripe-signature') ?? '';

    const event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      PRIVATE_STRIPE_ENDPOINT_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const quantity = parseInt(session.metadata?.quantity || '0');

        if (!userId || !quantity) {
          console.error('Missing userId or quantity in session metadata');
          return error(400, 'Missing required metadata');
        }

        // First read current value
        const { data: userData, error: readError } = await supabaseAdmin
          .from('user_payments')
          .select('remaining_generations')
          .eq('user_id', userId)
          .maybeSingle();

        if (readError) {
          console.error('Error reading user payment record:', readError);
          return error(500, 'Database error');
        }

        if (userData) {
          // Update existing record
          const { error: updateError } = await supabaseAdmin
            .from('user_payments')
            .update({
              remaining_generations: userData.remaining_generations + quantity
            })
            .eq('user_id', userId);

          if (updateError) {
            console.error('Error updating user payment record:', updateError);
            return error(500, 'Database error');
          }
        } else {
          // Create new record
          const { error: insertError } = await supabaseAdmin.from('user_payments').insert({
            user_id: userId,
            remaining_generations: quantity
          });

          if (insertError) {
            console.error('Error creating user payment record:', insertError);
            return error(500, 'Database error');
          }
        }

        break;
      }
      default: {
        console.debug(`Unhandled Stripe event: ${event.type}`);
      }
    }

    return json({ done: true });
  } catch (e) {
    console.debug(e);
    return error(500);
  }
};
