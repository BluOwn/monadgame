document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // State variables
    let provider = null;
    let signer = null;
    let userAddress = null;
    let contract = null;
    let isUpdating = false;

    // Smart contract details
    const contractAddress = '0x12b80421b226646eA44628F1cd7795E3247F9b33';
    const creatorAddress = '0x0b977acab5d9b8f654f48090955f5e00973be0fe';
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
    ]; ; // Your existing ABI

    // Update footer with addresses
    contractAddressElement.textContent = contractAddress;
    creatorAddressElement.textContent = formatAddress(creatorAddress);

    // Utility functions
    function formatAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    
    function showToast(message, type = 'success', duration = 3000) {
        // Add appropriate icon based on type
        let icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'info') icon = 'info-circle';
        
        toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // Enhanced animation functions
    async function animateMinting(amount) {
        return new Promise(resolve => {
            const gameContainer = document.createElement('div');
            gameContainer.className = 'minting-animation-container';
            document.body.appendChild(gameContainer);
            
            // Create falling coins animation with more dynamic positioning and timing
            for (let i = 0; i < amount * 3; i++) {
                setTimeout(() => {
                    Sounds.playCoin();
                    const coin = document.createElement('div');
                    coin.className = 'coin';
                    coin.style.left = `${Math.random() * 80 + 10}%`;
                    coin.style.animationDelay = `${Math.random() * 1}s`;
                    coin.style.animationDuration = `${1.5 + Math.random() * 1}s`;
                    coin.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
                    gameContainer.appendChild(coin);
                }, i * 100);
            }
            
            // Show success message with counter
            const counter = document.createElement('div');
            counter.className = 'minting-counter';
            counter.textContent = '0';
            gameContainer.appendChild(counter);
            
            // Animate counter from 0 to final amount with easing
            let count = 0;
            const frameDuration = 1500 / amount; // Total animation time divided by amount
            
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
                    }, 1500);
                }
            }, frameDuration);
        });
    }

    // Enhanced spin wheel with better visual feedback
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
            
            // Add numbers to the spinner for better visual indication
            for (let i = 1; i <= 10; i++) {
                const segment = document.createElement('div');
                segment.className = 'spinner-segment';
                segment.textContent = i;
                segment.style.transform = `rotate(${(i - 1) * 36}deg) translateY(-70px) rotate(-${(i - 1) * 36}deg)`;
                spinner.appendChild(segment);
            }
            
            const marker = document.createElement('div');
            marker.className = 'spinner-marker';
            
            const resultElement = document.createElement('div');
            resultElement.className = 'spinner-result';
            resultElement.innerHTML = '<i class="fas fa-sync fa-spin"></i> Spinning...';
            
            spinner.appendChild(marker);
            spinnerContainer.appendChild(spinner);
            spinnerContainer.appendChild(resultElement);
            document.body.appendChild(spinnerContainer);
            
            // Show final number after spin animation completes
            setTimeout(() => {
                Sounds.playSuccess();
                resultElement.innerHTML = `<i class="fas fa-trophy"></i> You won ${finalNumber} GMT!`;
                
                // Highlight the winning segment
                const segments = spinnerContainer.querySelectorAll('.spinner-segment');
                segments[finalNumber - 1].classList.add('winner');
                
                // Remove spinner after delay with smooth exit
                setTimeout(() => {
                    spinnerContainer.classList.add('fade-out');
                    setTimeout(() => {
                        document.body.removeChild(spinnerContainer);
                        resolve();
                    }, 1000);
                }, 2000);
            }, 2000);
        });
    }

    // Enhanced updateUserInfo with better loading indicators
    async function updateUserInfo() {
        if (!contract || isUpdating) return;
        
        isUpdating = true;
        
        try {
            // Update minted supply (available to all users)
            const loadingIndicator = '<div class="loading"><div></div><div></div><div></div><div></div></div>';
            mintedSupply.innerHTML = loadingIndicator;
            
            const totalMinted = await contract.mintedSupply();
            const formattedSupply = ethers.utils.formatUnits(totalMinted, 18);
            
            // Animate the supply count
            animateCounter(mintedSupply, 0, parseFloat(formattedSupply), 1000);
            
            // Update user-specific info if connected
            if (userAddress && signer) {
                dailyMints.innerHTML = loadingIndicator;
                gmtBalance.innerHTML = loadingIndicator;
                
                const mintCount = await contract.mintCount(userAddress);
                const balance = await contract.balanceOf(userAddress);
                
                const mintCountNumber = parseInt(mintCount.toString());
                const targetBalance = parseFloat(ethers.utils.formatUnits(balance, 18));
                
                // Animate both counters
                animateCounter(dailyMints, 0, mintCountNumber, 800);
                animateCounter(gmtBalance, 0, targetBalance, 1200);
                
                // Update progress bar with animation
                animateProgress(mintProgress, 0, mintCountNumber, 800);
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
            showToast('Failed to update user info', 'error', 3000);
        } finally {
            isUpdating = false;
        }
    }
    
    // Helper function to animate counters
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const updateInterval = 16; // ~60fps
        
        const animateFrame = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                // Use easeOutQuad for smoother animation
                const easedProgress = 1 - (1 - progress) * (1 - progress);
                const currentValue = start + (end - start) * easedProgress;
                
                element.textContent = Number.isInteger(end) 
                    ? Math.round(currentValue).toString() 
                    : currentValue.toFixed(2);
                
                requestAnimationFrame(animateFrame);
            } else {
                element.textContent = Number.isInteger(end) ? end.toString() : end.toFixed(2);
            }
        };
        
        requestAnimationFrame(animateFrame);
    }
    
    // Helper function to animate progress bar
    function animateProgress(element, start, end, duration) {
        const startTime = performance.now();
        
        const animateFrame = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const easedProgress = 1 - (1 - progress) * (1 - progress);
                const currentValue = start + (end - start) * easedProgress;
                
                element.value = Math.round(currentValue);
                requestAnimationFrame(animateFrame);
            } else {
                element.value = end;
            }
        };
        
        requestAnimationFrame(animateFrame);
    }

    // Check if MetaMask is installed
    if (!window.ethereum) {
        connectButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> MetaMask Not Detected';
        connectButton.disabled = true;
        connectButton.classList.add('error-button');
        
        // Add a helpful message
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.innerHTML = 'To play this game, please <a href="https://metamask.io/download/" target="_blank">install MetaMask</a>.';
        connectButton.parentNode.insertBefore(errorMsg, connectButton.nextSibling);
        
        return;
    }

    // Initialize provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Connect wallet with improved UX
    connectButton.addEventListener('click', async () => {
        try {
            // Visual feedback before connection
            connectButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            connectButton.disabled = true;
            
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
            
            // Update UI with a nice animation
            walletAddress.textContent = formatAddress(userAddress);
            walletInfo.classList.remove('hidden');
            walletInfo.style.opacity = 0;
            connectButton.style.display = 'none';
            gameResult.classList.add('hidden');
            disconnectMessage.classList.add('hidden');
            
            // Fade in wallet info
            setTimeout(() => {
                walletInfo.style.opacity = 1;
                walletInfo.style.transform = 'translateY(0)';
                showToast('<span>Connected successfully!</span>', 'success', 3000);
            }, 100);
            
            // Update mint count, balance, and supply
            await updateUserInfo();
        } catch (error) {
            console.error('Connection error:', error);
            showToast(`Connection failed: ${error.message}`, 'error', 5000);
            
            // Reset connection state on error
            provider = new ethers.providers.Web3Provider(window.ethereum);
            contract = new ethers.Contract(contractAddress, contractABI, provider);
            signer = null;
            userAddress = null;
            
            // Reset button state
            connectButton.innerHTML = '<i class="fas fa-wallet"></i> Connect MetaMask';
            connectButton.disabled = false;
        }
    });

    // Copy contract address with improved UX
    copyButton.addEventListener('click', () => {
        // Visual feedback
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Copying...';
        
        navigator.clipboard.writeText(contractAddress).then(() => {
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            showToast('Contract address copied to clipboard!', 'success', 3000);
            
            // Reset button after delay
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        }).catch((error) => {
            console.error('Failed to copy contract address:', error);
            copyButton.innerHTML = '<i class="fas fa-times"></i> Failed';
            showToast('Failed to copy contract address', 'error', 3000);
            
            // Reset button after delay
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    });

    // Play game with improved UX
    playButton.addEventListener('click', async () => {
        if (!signer || !userAddress || !contract) {
            showToast('Please connect your wallet first!', 'warning', 3000);
            return;
        }
        
        try {
            // Verify contract has signer
            if (!contract.signer) {
                // Reconnect signer if needed
                contract = contract.connect(signer);
            }
            
            // Disable button and show loading state
            const originalText = playButton.innerHTML;
            playButton.disabled = true;
            playButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            gameResult.classList.add('hidden');
            
            // Generate random number between 1 and 10
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            
            // First show the spinning animation
            await spinWheel(randomNumber);
            
            // Then call mint function on the contract
            const tx = await contract.mint(randomNumber);
            showToast('<span>Transaction submitted!</span>', 'info', 5000);
            
            await tx.wait();
            showToast('<span>Transaction confirmed!</span>', 'success', 3000);
            
            // Show minting animation
            await animateMinting(randomNumber);
            
            // Update UI
            gameResult.innerHTML = `<i class="fas fa-coins"></i> You received ${randomNumber} GMT tokens!`;
            gameResult.classList.remove('hidden');
            disconnectMessage.classList.add('hidden');
            
            // Update mint count, balance, and supply after minting
            await updateUserInfo();
        } catch (error) {
            console.error('Game error:', error);
            showToast(`Game error: ${error.reason || error.message}`, 'error', 5000);
            Sounds.playError();
        } finally {
            // Re-enable button
            playButton.disabled = false;
            playButton.innerHTML = originalText;
        }
    });

    // Disconnect wallet with improved UX
    disconnectButton.addEventListener('click', () => {
        // Visual feedback
        disconnectButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Disconnecting...';
        disconnectButton.disabled = true;
        
        setTimeout(() => {
            // Reset state
            provider = new ethers.providers.Web3Provider(window.ethereum);
            contract = new ethers.Contract(contractAddress, contractABI, provider);
            signer = null;
            userAddress = null;
            
            // Update UI with animation
            walletInfo.style.opacity = 0;
            walletInfo.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                walletInfo.classList.add('hidden');
                connectButton.style.display = 'block';
                gameResult.classList.add('hidden');
                walletAddress.textContent = '';
                dailyMints.textContent = '0';
                mintProgress.value = '0';
                gmtBalance.textContent = '0';
                
                // Reset disconnect button
                disconnectButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Disconnect';
                disconnectButton.disabled = false;
                
                // Show disconnect message
                showToast('Wallet disconnected successfully', 'info', 3000);
            }, 300);
        }, 500);
    });

    // Handle account or network change
    window.ethereum?.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
            showToast('Account changed, updating...', 'info', 3000);
            
            userAddress = accounts[0];
            walletAddress.textContent = formatAddress(userAddress);
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
            
            // Update UI with animation
            walletInfo.style.opacity = 0;
            setTimeout(() => {
                walletInfo.classList.add('hidden');
                connectButton.style.display = 'block';
                gameResult.classList.add('hidden');
                walletAddress.textContent = '';
                dailyMints.textContent = '0';
                mintProgress.value = '0';
                gmtBalance.textContent = '0';
                disconnectMessage.classList.add('hidden');
                
                showToast('Wallet disconnected', 'info', 3000);
            }, 300);
        }
    });

    // Handle network change
    window.ethereum?.on('chainChanged', () => {
        showToast('Network changed, refreshing...', 'info', 3000);
        setTimeout(() => window.location.reload(), 1500);
    });

    // Initial update of minted supply (for non-connected users)
    updateUserInfo();
    
    // Add some additional animations for initial page load
    document.querySelector('.container').classList.add('fade-in');
    
    // Add pulse animation to connect button to draw attention
    connectButton.classList.add('pulse');
});

// Add additional CSS needed for new components
document.head.insertAdjacentHTML('beforeend', `
<style>
/* Additional styling for new components */
.info-card {
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--border-radius);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    border-left: 3px solid var(--primary-light);
}

.info-card h3 {
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.info-card h3 i {
    color: var(--primary-light);
}

.label {
    color: var(--text-muted);
    margin-right: var(--spacing-sm);
}

.progress-container {
    display: flex;
    align-items: center;
}

.primary-button {
    background: linear-gradient(135deg, #7700ee, #aa44ff);
}

.secondary-button {
    background: linear-gradient(135deg, #444, #666);
}

.error-button {
    background: linear-gradient(135deg, #cc0000, #ff3333);
    cursor: not-allowed;
}

.pulse {
    animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
    0% { box-shadow: 0 0 0 0 rgba(150, 0, 255, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(150, 0, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(150, 0, 255, 0); }
}

.fade-in {
    animation: fadeInAnimation 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes fadeInAnimation {
    to { opacity: 1; transform: translateY(0); }
}

.toast.success { border-left: 4px solid #55ff7f; }
.toast.error { border-left: 4px solid #ff5555; }
.toast.warning { border-left: 4px solid #ffaa00; }
.toast.info { border-left: 4px solid #00aaff; }

.spinner-segment {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 10px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
}

.spinner-segment.winner {
    color: white;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    animation: highlight 0.5s infinite alternate;
}

@keyframes highlight {
    from { color: white; text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); }
    to { color: yellow; text-shadow: 0 0 15px rgba(255, 255, 0, 0.8); }
}

.instructions-card {
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--border-radius);
    margin-top: var(--spacing-xl);
    padding: var(--spacing-md);
    border-left: 3px solid var(--accent);
    text-align: left;
}

.instructions-card h3 {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: 0;
}

.instructions-card ol {
    margin: var(--spacing-md) 0 0;
    padding-left: var(--spacing-xl);
}

.instructions-card li {
    margin-bottom: var(--spacing-sm);
}

.navigation-links {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin: var(--spacing-md) 0;
}

.footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-xl);
}

/* Additional responsive styles */
@media (max-width: 480px) {
    .footer-content {
        flex-direction: column;
        gap: var(--spacing-xs);
    }
}
</style>
`);