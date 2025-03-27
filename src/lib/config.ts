type ConfigType = {
  name: string;
  description: string;
  noIndex: boolean;
  googleLogin: boolean;
  links: {
    instagram?: string;
    linkedin?: string;
    x?: string;
    mail?: string;
  };
};

const config: ConfigType = {
  name: 'Avatarify AI',
  description: 'Avatarify AI is a platform for creating and editing avatars',

  noIndex: false,
  googleLogin: false,
  links: {
    x: 'https://x.com/avatarify_ai',
    mail: 'hi@avatarify-ai.com'
  }
};

export type Config = typeof config;
export default config;
