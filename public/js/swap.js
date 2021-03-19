const connectButton = document.querySelector('.web3-connect');

connectButton.addEventListener('click', async function () {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  }

  const accounts = await ethereum.request({method: 'eth_requestAccounts'});
  const account = accounts[0];

  console.log(account);

  return false;
});
