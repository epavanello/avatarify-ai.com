import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY, PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase-types';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const GET: RequestHandler = async ({ url, locals: { session } }) => {
  const session_id = url.searchParams.get('session_id');

  if (!session || !session.user) {
    return error(401, 'Unauthorized');
  }
  if (!session_id) {
    return error(400, 'Missing session_id');
  }
  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (stripeSession.status === 'complete') {
      if (!stripeSession.metadata?.id) {
        return error(400, 'Missing picture_id');
      }
      await supabaseAdmin
        .from('payments')
        .upsert({
          picture_id: stripeSession.metadata.id,
          uid: session.user.id,
          stripe_session_id: stripeSession.id
        })
        .throwOnError();
    }

    return new Response(
      JSON.stringify({
        status: stripeSession.status,
        payment_status: stripeSession.payment_status,
        customer_email: stripeSession.customer_details?.email
      }),
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return error(500, 'Replicate error');
  }
};
