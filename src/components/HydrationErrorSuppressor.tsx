/**
 * Suppresses hydration warnings caused by browser extension DOM injection
 * (e.g., `bis_skin_checked="1"` injected by Bitdefender, IDM, etc.).
 *
 * Only runs on localhost and ONLY suppresses messages that contain
 * `bis_skin_checked`. Real hydration errors from application code
 * are NOT suppressed and will remain visible in the console.
 */
export function HydrationErrorSuppressor() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            const _origError = console.error;
            console.error = function (...args) {
              const msg = typeof args[0] === 'string'
                ? args[0]
                : (args[0] instanceof Error ? args[0].message : '');
              if (msg && msg.includes('bis_skin_checked')) return;
              _origError.apply(console, args);
            };

            window.addEventListener('error', function(event) {
              const msg = event.message || (event.error && event.error.message) || '';
              if (msg.includes('bis_skin_checked')) {
                event.stopImmediatePropagation();
              }
            });
          }
        `,
      }}
    />
  );
}
