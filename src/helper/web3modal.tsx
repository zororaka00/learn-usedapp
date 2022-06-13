import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";

export const useConnectWallet = async () => {
    try {
      const chainid: number = Number(process.env.REACT_APP_CHAIN_ID_BSC_TESTNET);
      const customMetamaskOption = {
        'custom-metamask-wallet': {
          display: {
            logo: 'metamask.svg',
            name: 'Metamask Wallet',
            description: 'Connect to your Metamask Wallet',
          },
          package: true,
          options: {},
          connector: async () => {
            const eth = (window as any).ethereum;
            if (eth.isMetaMask) {
              await eth.request({ method: 'eth_requestAccounts' });
              return eth;
            } else {
              (window as any).open("https://metamask.app.link", "_blank");
              throw new Error('No Metamask wallet found');
            }
          },
        },
      };

      const customBinanceProviderOption = {
          'custom-binance-wallet': {
              display: {
              logo: "bsc.svg",
              name: 'Binance Chain Wallet',
              description: 'Connect to your Binance Chain Wallet',
              },
              package: true,
              options: {},
              connector: async () => {
                  if ((window as any).BinanceChain) {
                      const provider = (window as any).BinanceChain;
                      await provider.request({ method: 'eth_requestAccounts' });
                      return provider;
                  } else {
                      (window as any).open("https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp", "_blank");
                      throw new Error('No Binance Chain wallet found');
                  }
              },
          },
      };

      const customBitkeepProviderOption = {
        'custom-bitkeep-wallet': {
          display: {
            logo: 'bitkeep.png',
            name: 'Bitkeep Wallet',
            description: 'Connect to your Bitkeep Wallet',
          },
          package: true,
          options: {},
          connector: async () => {
            if ((window as any).bitkeep) {
              const bitkeep = (window as any).bitkeep;
              await bitkeep.ethereum.request({ method: 'eth_requestAccounts' });
              return bitkeep.ethereum;
            } else {
              (window as any).open("https://bitkeep.com/download", "_blank");
              throw new Error('No Bitkeep wallet found');
            }
          },
        },
      };

      const customSafePalProviderOption = {
        'custom-safepal': {
          display: {
            logo: 'safepal.svg',
            name: 'SafePal Wallet',
            description: 'Mobile web only',
          },
          package: true,
          options: {},
          connector: async () => {
            if ((window as any).ethereum) {
              const provider = (window as any).ethereum;
              await provider.request({ method: 'eth_requestAccounts' });
              return provider;
            } else {
              (window as any).open("https://safepal.io/download", "_blank");
              throw new Error('No SafePal wallet found');
            }
          },
        },
      };

      const providerOptions = {
          walletconnect: {
              package: WalletConnectProvider, // required
              options: {
                  rpc: {
                      56: "https://bsc-dataseed1.defibit.io",
                  },
                  network: 'binance',
              },
          },
          torus: {
              package: Torus, // required
              options: {
              networkParams: {
                  host: process.env.REACT_APP_RPC_URL_BSC_TESTNET as string, // optional
                  chainId: chainid, // optional
                  networkId: chainid // optional
              }
              }
          },
          ...customMetamaskOption,
          ...customBitkeepProviderOption,
          ...customBinanceProviderOption,
          ...customSafePalProviderOption,
      };
      const web3Modal = new Web3Modal({
          disableInjectedProvider: true,
          cacheProvider: false,
          providerOptions, // required
          theme: "dark",
      });
      const provider = await web3Modal.connect();
      return provider;
    } catch(err) {
      throw err;
    }
}