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
    ]; 

    // Update footer with addresses
    contractAddressElement.textContent = contractAddress;
    creatorAddressElement.textContent = creatorAddress;

    // Utility functions
    function showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // Animation functions
    async function animateMinting(amount) {
        return new Promise(resolve => {
            const gameContainer = document.createElement('div');
            gameContainer.className = 'minting-animation-container';
            document.body.appendChild(gameContainer);
            
            // Create falling coins animation
            for (let i = 0; i < amount; i++) {
                setTimeout(() => {
                    Sounds.playCoin();
                    const coin = document.createElement('div');
                    coin.className = 'coin';
                    coin.style.left = `${Math.random() * 80 + 10}%`;
                    coin.style.animationDelay = `${Math.random() * 0.5}s`;
                    gameContainer.appendChild(coin);
                }, i * 200);
            }
            
            // Show success message with counter
            const counter = document.createElement('div');
            counter.className = 'minting-counter';
            counter.textContent = '0';
            gameContainer.appendChild(counter);
            
            // Animate counter from 0 to final amount
            let count = 0;
            const intervalId = setInterval(() => {
                count++;
                counter.textContent = count;
                if (count >= amount) {
                    clearInterval(intervalId);
                    setTimeout(() => {
                        gameContainer.classList.add('fade-out');
                        setTimeout(() => {
                            document.body.removeChild(gameContainer);
                            resolve();
                        }, 1000);
                    }, 2000);
                }
            }, 100);
        });
    }

    async function spinWheel(finalNumber) {
        return new Promise(resolve => {
            // Play spin sound
            Sounds.playSpin();
            
            // Calculate final position (each number gets 36 degrees)
            const resultRotation = ((finalNumber - 1) * 36) + 18; // Center of segment
            
            const spinnerContainer = document.createElement('div');
            spinnerContainer.className = 'spinner-container';
            
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            spinner.style.setProperty('--result-rotation', `${resultRotation}deg`);
            
            const marker = document.createElement('div');
            marker.className = 'spinner-marker';
            
            const resultElement = document.createElement('div');
            resultElement.className = 'spinner-result';
            resultElement.textContent = 'Spinning...';
            
            spinner.appendChild(marker);
            spinnerContainer.appendChild(spinner);
            spinnerContainer.appendChild(resultElement);
            document.body.appendChild(spinnerContainer);
            
            // Show final number after spin animation completes
            setTimeout(() => {
                Sounds.playSuccess();
                resultElement.textContent = `You won ${finalNumber} GMT!`;
                
                // Remove spinner after delay
                setTimeout(() => {
                    spinnerContainer.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(spinnerContainer);
                        resolve();
                    }, 1000);
                }, 2000);
            }, 2000);
        });
    }

    // Check if MetaMask is installed
    if (!window.ethereum) {
        alert('Please install MetaMask to play this game!');
        connectButton.disabled = true;
        return;
    }

    // Initialize provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Function to update mint count, balance, and total minted supply
    async function updateUserInfo() {
        if (!contract) return;
        try {
            // Update minted supply (available to all users)
            mintedSupply.innerHTML = '<div class="loading"><div></div><div></div><div></div><div></div></div>';
            const totalMinted = await contract.mintedSupply();
            mintedSupply.textContent = ethers.utils.formatUnits(totalMinted, 18);

            // Update user-specific info if connected
            if (userAddress && signer) {
                dailyMints.innerHTML = '<div class="loading"><div></div><div></div><div></div><div></div></div>';
                gmtBalance.innerHTML = '<div class="loading"><div></div><div></div><div></div><div></div></div>';
                
                const mintCount = await contract.mintCount(userAddress);
                const balance = await contract.balanceOf(userAddress);
                
                // Animate the counts
                let currentMintCount = 0;
                let currentBalance = 0;
                const targetBalance = parseFloat(ethers.utils.formatUnits(balance, 18));
                
                // Animation for mint count
                const mintInterval = setInterval(() => {
                    if (currentMintCount < parseInt(mintCount.toString())) {
                        currentMintCount++;
                        dailyMints.textContent = currentMintCount.toString();
                        mintProgress.value = currentMintCount.toString();
                    } else {
                        clearInterval(mintInterval);
                    }
                }, 50);
                
                // Animation for balance
                const balanceInterval = setInterval(() => {
                    if (currentBalance < targetBalance) {
                        currentBalance += targetBalance / 20; // Increment by 5% of target each time
                        if (currentBalance > targetBalance) currentBalance = targetBalance;
                        gmtBalance.textContent = currentBalance.toFixed(2);
                    } else {
                        clearInterval(balanceInterval);
                        gmtBalance.textContent = targetBalance.toString();
                    }
                }, 50);
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
            showToast('Failed to update user info', 3000);
        }
    }

// Modified connect function with improved error handling and contract initialization
connectButton.addEventListener('click', async () => {
    try {
        // Reset any previous state to avoid conflicts
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }
        
        userAddress = accounts[0];
        console.log("Connected address:", userAddress);
        
        // Get signer and verify it works
        signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log("Signer address:", signerAddress);
        
        // Ensure the addresses match
        if (signerAddress.toLowerCase() !== userAddress.toLowerCase()) {
            throw new Error('Signer address mismatch');
        }
        
        // Create a fresh contract instance with the signer
        contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        
        // Verify contract methods exist
        if (typeof contract.mint !== 'function') {
            console.error("Contract methods:", Object.keys(contract.functions));
            throw new Error('Contract is missing required methods. Check ABI and contract address.');
        }
        
        // Quick test call to a view function to verify connection
        try {
            const name = await contract.name();
            console.log("Contract name:", name);
        } catch (err) {
            console.error("Test call failed:", err);
            throw new Error('Could not connect to contract. Check that you are on the correct network.');
        }
        
        // Update UI only after everything is verified
        walletAddress.textContent = userAddress;
        walletInfo.classList.remove('hidden');
        connectButton.style.display = 'none';
        gameResult.classList.add('hidden');
        disconnectMessage.classList.add('hidden');
        
        showToast('Connected successfully!', 3000);
        
        // Update mint count, balance, and supply
        await updateUserInfo();
    } catch (error) {
        console.error('Connection error:', error);
        showToast(`Connection failed: ${error.message}`, 5000);
        
        // Reset connection state on error
        provider = new ethers.providers.Web3Provider(window.ethereum);
        contract = null;
        signer = null;
        userAddress = null;
    }
});

    // Copy contract address
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(contractAddress).then(() => {
            showToast('Contract address copied to clipboard!', 3000);
        }).catch((error) => {
            console.error('Failed to copy contract address:', error);
            showToast('Failed to copy contract address', 3000);
        });
    });

    // Play game: Generate random number (1-10) and mint tokens
    playButton.addEventListener('click', async () => {
        if (!signer || !userAddress || !contract) {
            showToast('Please connect your wallet first!', 3000);
            return;
        }
        
        try {
            // Verify contract has signer
            if (!contract.signer) {
                // Reconnect signer if needed
                contract = contract.connect(signer);
            }
            
            // Disable button and show loading state
            playButton.disabled = true;
            playButton.textContent = 'Processing...';
            gameResult.classList.add('hidden');
            
            // Generate random number between 1 and 10
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            
            // First show the spinning animation
            await spinWheel(randomNumber);
            
            // Then call mint function on the contract
            const tx = await contract.mint(randomNumber);
            showToast('Transaction submitted! Waiting for confirmation...', 5000);
            
            await tx.wait();
            showToast('Transaction confirmed!', 3000);
            
            // Show minting animation
            await animateMinting(randomNumber);
            
            // Update UI
            gameResult.textContent = `You received ${randomNumber} GMT tokens!`;
            gameResult.classList.remove('hidden');
            disconnectMessage.classList.add('hidden');
            
            // Update mint count, balance, and supply after minting
            await updateUserInfo();
        } catch (error) {
            console.error('Game error:', error);
            showToast(`Game error: ${error.reason || error.message}`, 5000);
            Sounds.playError();
        } finally {
            // Re-enable button
            playButton.disabled = false;
            playButton.textContent = 'Spin to Win!';
        }
    });

    // Disconnect wallet
    disconnectButton.addEventListener('click', () => {
        // Reset state
        provider = new ethers.providers.Web3Provider(window.ethereum);
        contract = new ethers.Contract(contractAddress, contractABI, provider);
        signer = null;
        userAddress = null;
        
        // Update UI
        walletInfo.classList.add('hidden');
        connectButton.style.display = 'block';
        gameResult.classList.add('hidden');
        walletAddress.textContent = '';
        dailyMints.textContent = '0';
        mintProgress.value = '0';
        gmtBalance.textContent = '0';
        
        // Show disconnect message but don't reload automatically
        showToast('Wallet disconnected successfully', 3000);
    });

    // Handle account or network change
    window.ethereum?.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
            userAddress = accounts[0];
            walletAddress.textContent = userAddress;
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            walletInfo.classList.remove('hidden');
            connectButton.style.display = 'none';
            gameResult.classList.add('hidden');
            disconnectMessage.classList.add('hidden');
            await updateUserInfo();
        } else {
            // Reset state when account disconnected
            provider = new ethers.providers.Web3Provider(window.ethereum);
            contract = new ethers.Contract(contractAddress, contractABI, provider);
            signer = null;
            userAddress = null;
            
            // Update UI
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

    // Handle network change
    window.ethereum?.on('chainChanged', () => {
        window.location.reload();
    });

    // Initial update of minted supply (for non-connected users)
    updateUserInfo();
});