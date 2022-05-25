import './App.css';
import {
  useEtherBalance,
  useSendTransaction,
  useContractFunction,
  useEthers,
  useTransactions,
  useCall,
  Rinkeby
} from '@usedapp/core';
import { utils, Contract } from 'ethers';
import TesAbi from './Tes_abi.json';

function App() {
  const { activateBrowserWallet, chainId, account } = useEthers();
  const etherBalance = useEtherBalance(account, { chainId });
  const { sendTransaction } = useSendTransaction();
  const { transactions } = useTransactions()

  const sendBNB = async () => {
    await sendTransaction({ to: "0xa8bf3aC4f567384F2f44B4E7C6d11b7664749f35", value: utils.parseEther("0.001"), chainId });
  }

  // Interaction Contract
  const TesInterface = new utils.Interface(TesAbi)
  const instance = new Contract(process.env.REACT_APP_CONTRACT_ADDRESS_BSC_TESTNET as string, TesInterface);
  const { state, send:Set } = useContractFunction(instance, "addNames", { transactionName: "Add Name", });
  const { value:getindex, error:a } = useCall(account && process.env.REACT_APP_CONTRACT_ADDRESS_BSC_TESTNET as string && {
    contract: instance,
    method: "index",
    args: []
  }) ?? {};
  const { value:getname, error:b } = useCall(account && process.env.REACT_APP_CONTRACT_ADDRESS_BSC_TESTNET as string && {
    contract: instance,
    method: "names",
    args: [2]
  }) ?? {};
  const AddNames = async () => {
    await Set('tesname');
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
        {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}
        {account && <p>Account Address: {account}</p>}
        {etherBalance && <p>Balance: {(Number(utils.formatUnits(etherBalance, 18))).toFixed(4)} {chainId == Rinkeby.chainId ? 'ETH' : 'BNB'}</p>}
        {account && <p><button onClick={sendBNB}>Send BNB</button></p>}
        {account && <p><button onClick={AddNames}>Add Names to Contract</button></p>}
        {account && <p><button onClick={GetData}>Get Data</button></p>}
      </header>
    </div>
  );
}

export default App;
