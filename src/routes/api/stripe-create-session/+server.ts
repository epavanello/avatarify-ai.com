import { error, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_STRIPE_PRICE_ID, PUBLIC_WEBSITE_HOST } from '$env/static/public';

const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia'
});

export const POST: RequestHandler = async ({ locals: { session } }) => {
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: PUBLIC_STRIPE_PRICE_ID,
          quantity: 20,
          adjustable_quantity: {
            enabled: true,
            minimum: 10,
            maximum: 100
          }
        }
      ],
      customer_email: session?.user?.email,
      metadata: session?.user?.id ? { userId: session?.user?.id } : undefined,
      mode: 'payment',
      ui_mode: 'embedded',
      return_url: `${PUBLIC_WEBSITE_HOST}/?session_id={CHECKOUT_SESSION_ID}`
    });

    return new Response(
      JSON.stringify({
        clientSecret: stripeSession.client_secret
      }),
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return error(500, 'Stripe session error');
  }
};
