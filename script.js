document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connectButton');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const dailyMints = document.getElementById('dailyMints');
    const mintProgress = document.getElementById('mintProgress');
    const gmtBalance = document.getElementById('gmtBalance');
    const mintedSupply = document.getElementById('mintedSupply');
    const copyButton = document.getElementById('copyButton');
    const playButton = document.getElementById('playButton');
    const disconnectButton = document.getElementById('disconnectButton');
    const gameResult = document.getElementById('gameResult');
    const disconnectMessage = document.getElementById('disconnectMessage');
    const contractAddressElement = document.getElementById('contractAddress');
    const creatorAddressElement = document.getElementById('creatorAddress');
    let provider = null;
    let signer = null;
    let userAddress = null;
    let contract = null;
    let web3Modal = null;

    // Smart contract details
    const contractAddress = '0x12b80421b226646eA44628F1cd7795E3247F9b33'; // Replace with your deployed contract address
    const creatorAddress = '0x0b977acab5d9b8f654f48090955f5e00973be0fe'; // Replace with your MetaMask address
    const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "CREATOR_ADDRESS",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_MINT_PER_DAY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_TOKENS_PER_MINT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TOTAL_SUPPLY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentDay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastMintDay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "mintCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintedSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; // Replace with the ABI from Remix

    // Update footer with addresses
    contractAddressElement.textContent = contractAddress;
    creatorAddressElement.textContent = creatorAddress;

    // Initialize Web3Modal
    const providerOptions = {
        walletconnect: {
            package: window.WalletConnectProvider.default,
            options: {
                rpc: {
                    10143: 'https://testnet-rpc.monad.xyz', // Monad Testnet RPC
                },
                chainId: 10143, // Monad Testnet Chain ID
            },
        },
        injected: {
            display: {
                name: 'Injected',
                description: 'Connect with the provider in your Browser',
            },
            package: null,
        },
    };

    web3Modal = new window.Web3Modal.default({
        cacheProvider: false,
        providerOptions,
        theme: 'dark',
    });

    // Function to update mint count, balance, and total minted supply
    async function updateUserInfo() {
        if (!contract) return;
        try {
            // Update minted supply (available to all users)
            const totalMinted = await contract.mintedSupply();
            mintedSupply.textContent = ethers.utils.formatUnits(totalMinted, 18);

            // Update user-specific info if connected
            if (userAddress) {
                const mintCount = await contract.mintCount(userAddress);
                const balance = await contract.balanceOf(userAddress);
                dailyMints.textContent = mintCount.toString();
                mintProgress.value = mintCount.toString();
                gmtBalance.textContent = ethers.utils.formatUnits(balance, 18);
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
        }
    }

    // Connect to wallet
    connectButton.addEventListener('click', async () => {
        try {
            // Connect using Web3Modal
            const web3Provider = await web3Modal.connect();
            provider = new ethers.providers.Web3Provider(web3Provider);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            walletAddress.textContent = userAddress;
            walletInfo.classList.remove('hidden');
            connectButton.style.display = 'none';
            gameResult.classList.add('hidden');
            disconnectMessage.classList.add('hidden');

            // Initialize contract
            contract = new ethers.Contract(contractAddress, contractABI, provider).connect(signer);

            // Update mint count, balance, and supply
            await updateUserInfo();
        } catch (error) {
            console.error('Failed to connect to wallet:', error);
            disconnectMessage.textContent = 'Failed to connect to wallet. Please try again.';
            disconnectMessage.classList.remove('hidden');
        }
    });

    // Copy contract address
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(contractAddress).then(() => {
            disconnectMessage.textContent = 'Contract address copied to clipboard!';
            disconnectMessage.classList.remove('hidden');
            setTimeout(() => {
                disconnectMessage.classList.add('hidden');
            }, 2000);
        }).catch((error) => {
            console.error('Failed to copy contract address:', error);
            disconnectMessage.textContent = 'Failed to copy contract address. Please try again.';
            disconnectMessage.classList.remove('hidden');
        });
    });

    // Play game: Generate random number (1-10) and mint tokens
    playButton.addEventListener('click', async () => {
        if (!signer || !userAddress || !contract) {
            disconnectMessage.textContent = 'Please connect your wallet first!';
            disconnectMessage.classList.remove('hidden');
            return;
        }

        try {
            // Generate random number between 1 and 10
            const randomNumber = Math.floor(Math.random() * 10) + 1;

            // Call mint function on the contract (amount in tokens, not wei)
            const tx = await contract.mint(randomNumber);
            await tx.wait();

            gameResult.textContent = `You received ${randomNumber} GMT tokens!`;
            gameResult.classList.remove('hidden');
            disconnectMessage.classList.add('hidden');

            // Update mint count, balance, and supply after minting
            await updateUserInfo();
        } catch (error) {
            console.error('Game error:', error);
            disconnectMessage.textContent = `Failed to play the game: ${error.reason || error.message}`;
            disconnectMessage.classList.remove('hidden');
        }
    });

    // Disconnect wallet and refresh page
    disconnectButton.addEventListener('click', async () => {
        try {
            await web3Modal.clearCachedProvider();
            provider = null;
            signer = null;
            userAddress = null;
            contract = null;
            walletInfo.classList.add('hidden');
            connectButton.style.display = 'block';
            gameResult.classList.add('hidden');
            walletAddress.textContent = '';
            dailyMints.textContent = '0';
            mintProgress.value = '0';
            gmtBalance.textContent = '0';
            disconnectMessage.classList.remove('hidden');
            setTimeout(() => window.location.reload(), 1000); // Refresh after 1 second
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    });

    // Handle account or network change
    if (window.ethereum || window.web3) {
        const web3Provider = window.ethereum || window.web3.currentProvider;
        web3Provider.on('accountsChanged', async (accounts) => {
            if (accounts.length > 0) {
                userAddress = accounts[0];
                walletAddress.textContent = userAddress;
                signer = provider.getSigner();
                contract = contract.connect(signer);
                walletInfo.classList.remove('hidden');
                connectButton.style.display = 'none';
                gameResult.classList.add('hidden');
                disconnectMessage.classList.add('hidden');
                await updateUserInfo();
            } else {
                provider = null;
                signer = null;
                userAddress = null;
                contract = null;
                walletInfo.classList.add('hidden');
                connectButton.style.display = 'block';
                gameResult.classList.add('hidden');
                walletAddress.textContent = '';
                dailyMints.textContent = '0';
                mintProgress.value = '0';
                gmtBalance.textContent = '0';
                disconnectMessage.classList.add('hidden');
            }
        });

        web3Provider.on('chainChanged', async () => {
            provider = new ethers.providers.Web3Provider(web3Provider);
            contract = new ethers.Contract(contractAddress, contractABI, provider);
            if (userAddress) {
                signer = provider.getSigner();
                contract = contract.connect(signer);
                await updateUserInfo();
            }
        });
    }

    // Initial update of minted supply (for non-connected users)
    updateUserInfo();
});
