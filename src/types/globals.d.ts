// types/global.d.ts
export {};

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace accounts.id {
      function initialize(options: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
      }): void;

      function renderButton(
        parent: HTMLElement,
        options: {
          theme: 'outline' | 'filled_blue' | 'filled_black';
          size: 'small' | 'medium' | 'large';
        }
      ): void;
    }

    interface CredentialResponse {
      credential: string;
      select_by: string;
    }
  }
}
