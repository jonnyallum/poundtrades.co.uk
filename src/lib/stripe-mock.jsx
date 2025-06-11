// Mock Stripe implementation for development and testing

export const loadStripe = (publishableKey) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          elements: () => ({
            create: (type) => ({
              mount: () => {},
              unmount: () => {},
              on: () => {},
              update: () => {},
            }),
            getElement: (type) => ({
              // Mock CardElement
              _element: {},
            }),
          }),
          confirmCardPayment: (clientSecret, options) => {
            return new Promise(resolve => {
              setTimeout(() => {
                // Simulate success or failure
                if (clientSecret === 'mock_client_secret_123') {
                  resolve({ paymentIntent: { status: 'succeeded' } });
                } else {
                  resolve({ error: { message: 'Mock payment failed.' } });
                }
              }, 1000);
            });
          },
        });
      }, 500);
    });
  };
  
  export const Elements = ({ stripe, children }) => {
    return children;
  };
  
  export const CardElement = () => {
    return <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>Mock Card Element</div>;
  };
  
  export const useStripe = () => {
    return {
      confirmCardPayment: (clientSecret, options) => {
        return new Promise(resolve => {
          setTimeout(() => {
            if (clientSecret === 'mock_client_secret_123') {
              resolve({ paymentIntent: { status: 'succeeded' } });
            } else {
              resolve({ error: { message: 'Mock payment failed.' } });
            }
          }, 1000);
        });
      },
    };
  };
  
  export const useElements = () => {
    return {
      getElement: (type) => ({
        // Mock CardElement
        _element: {},
      }),
    };
  };
  

