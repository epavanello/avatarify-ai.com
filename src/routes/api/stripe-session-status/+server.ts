import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_STRIPE_PRICE_ID, PUBLIC_WEBSITE_HOST } from '$env/static/public';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const GET: RequestHandler = async ({ url, locals: { getSession } }) => {
  const session = await getSession();
  const session_id = url.searchParams.get('session_id');

  if (!session || !session.user) {
    return error(401, 'Unauthorized');
  }
  if (!session_id) {
    return error(400, 'Missing session_id');
  }
  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

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
