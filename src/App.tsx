import './App.css';
import {
  useEtherBalance,
  useSendTransaction,
  useEthers,
  useTransactions,
  Rinkeby,
  useCall,
  useContractFunction
} from '@usedapp/core';
import { utils, Contract } from 'ethers';
import { useConnectWallet } from "./helper";
import TesAbi from './assets/Tes_abi.json';

function App() {
  const { activate, deactivate, chainId, account } = useEthers();
  const etherBalance = useEtherBalance(account, { chainId });
  const { sendTransaction } = useSendTransaction();
  const { transactions } = useTransactions();

  const Connect = async () => {
    const provider = await useConnectWallet();
    await activate(provider);
  }

  const sendBNB = async () => {
    await sendTransaction({ to: "0xa8bf3aC4f567384F2f44B4E7C6d11b7664749f35", value: utils.parseEther("0.001"), chainId });
  }

  // Interaction Contract
  const TesInterface = new utils.Interface(TesAbi)
  const instance = new Contract(process.env.REACT_APP_CONTRACT_ADDRESS_BSC_TESTNET as string, TesInterface);
  const { state, send:SetName } = useContractFunction(instance, "addNames", { transactionName: "Add Name", });
  const { value:getindex, error:a } = useCall(account && process.env.REACT_APP_CONTRACT_ADDRESS_BSC_TESTNET as string && {
      contract: instance,
      method: "index",
      args: []
  }) ?? {};
  const { value:getname, error:b } = useCall(account && process.env.REACT_APP_CONTRACT_ADDRESS_BSC_TESTNET as string && {
      contract: instance,
      method: "names",
      args: [Number(getindex) - 1]
  }) ?? {};

  const AddNames = async () => {
    await SetName('tesname');
    const getdata = transactions[transactions.length - 1].receipt;
    const { status } = state;
    console.log('status', status);
    console.log('blockNumber: ', getdata?.blockNumber);
    console.log('transactionHash: ', getdata?.transactionHash);
    console.log('from: ', getdata?.from);
    console.log('to: ', getdata?.to);
  }

  const GetData = async () => {
    console.log('index: ', Number(getindex));
    console.log('Last Name: ', getname[0]);
  }

  return (
    <div className="App">
      <header className="App-header">
        {!account && <button onClick={() => Connect()}>Connect</button>}
        {account && <p>Account Address: {account}</p>}
        {etherBalance && <p>Balance: {(Number(utils.formatUnits(etherBalance, 18))).toFixed(4)} {chainId == Rinkeby.chainId ? 'ETH' : 'BNB'}</p>}
        {account && <p><button onClick={sendBNB}>Send BNB</button></p>}
        {account && <p><button onClick={AddNames}>Add Names to Contract</button></p>}
        {account && <p><button onClick={GetData}>Get Data</button></p>}
        {account && <p><button onClick={deactivate}>Logout</button></p>}
      </header>
    </div>
  );
}

export default App;
