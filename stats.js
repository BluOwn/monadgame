// Game statistics
const GameStats = {
    initialize: function(userAddress) {
        // Initialize stats if not already in localStorage
        if (!localStorage.getItem(`stats_${userAddress}`)) {
            const initialStats = {
                totalSpins: 0,
                tokensWon: 0,
                bestSpin: 0,
                lastSpin: 0,
                firstPlay: Date.now()
            };
            localStorage.setItem(`stats_${userAddress}`, JSON.stringify(initialStats));
        }
    },
    
    // Update stats after each play
    update: function(userAddress, tokensWon) {
        if (!userAddress) return;
        
        // Get current stats
        const statsJson = localStorage.getItem(`stats_${userAddress}`);
        if (!statsJson) {
            this.initialize(userAddress);
        }
        
        const stats = JSON.parse(localStorage.getItem(`stats_${userAddress}`));
        
        // Update values
        stats.totalSpins += 1;
        stats.tokensWon += tokensWon;
        stats.lastSpin = tokensWon;
        if (tokensWon > stats.bestSpin) {
            stats.bestSpin = tokensWon;
        }
        
        // Save updated stats
        localStorage.setItem(`stats_${userAddress}`, JSON.stringify(stats));
        
        // Also update leaderboard if applicable
        this.updateLeaderboard(userAddress, stats);
    },
    
    // Get user's stats
    getStats: function(userAddress) {
        if (!userAddress) return null;
        
        const statsJson = localStorage.getItem(`stats_${userAddress}`);
        if (!statsJson) {
            this.initialize(userAddress);
            return JSON.parse(localStorage.getItem(`stats_${userAddress}`));
        }
        
        return JSON.parse(statsJson);
    },
    
    // Update global leaderboard
    updateLeaderboard: function(userAddress, stats) {
        // Get current leaderboard
        let leaderboard = localStorage.getItem('global_leaderboard');
        if (!leaderboard) {
            leaderboard = '[]';
        }
        
        // Parse leaderboard
        let leaderboardArray = JSON.parse(leaderboard);
        
        // Find existing entry or create a new one
        const existingEntryIndex = leaderboardArray.findIndex(entry => entry.address === userAddress);
        
        if (existingEntryIndex !== -1) {
            // Update existing entry
            leaderboardArray[existingEntryIndex] = {
                address: userAddress,
                tokensWon: stats.tokensWon,
                bestSpin: stats.bestSpin,
                totalSpins: stats.totalSpins
            };
        } else {
            // Add new entry
            leaderboardArray.push({
                address: userAddress,
                tokensWon: stats.tokensWon,
                bestSpin: stats.bestSpin,
                totalSpins: stats.totalSpins
            });
        }
        
        // Sort by tokens won (descending)
        leaderboardArray.sort((a, b) => b.tokensWon - a.tokensWon);
        
        // Keep only top 10
        if (leaderboardArray.length > 10) {
            leaderboardArray = leaderboardArray.slice(0, 10);
        }
        
        // Save leaderboard
        localStorage.setItem('global_leaderboard', JSON.stringify(leaderboardArray));
    },
    
    // Get global leaderboard
    getLeaderboard: function() {
        const leaderboard = localStorage.getItem('global_leaderboard');
        if (!leaderboard) return [];
        
        return JSON.parse(leaderboard);
    },
    
    // Show stats modal
    showStats: function(userAddress) {
        const stats = this.getStats(userAddress);
        if (!stats) return;
        
        const leaderboard = this.getLeaderboard();
        
        // Calculate user's rank
        let userRank = 'Not ranked';
        const userIndex = leaderboard.findIndex(entry => entry.address === userAddress);
        if (userIndex !== -1) {
            userRank = `#${userIndex + 1}`;
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'stats-modal';
        
        // Calculate time played
        const daysSinceFirstPlay = Math.floor((Date.now() - stats.firstPlay) / (1000 * 60 * 60 * 24));
        
        let statsHTML = '<div class="stats-container">';
        statsHTML += '<h2>Your Game Stats</h2>';
        
        // User stats section
        statsHTML += '<div class="stats-section">';
        statsHTML += `<div class="stat-item"><span>Total Spins:</span> <span>${stats.totalSpins}</span></div>`;
        statsHTML += `<div class="stat-item"><span>Tokens Won:</span> <span>${stats.tokensWon}</span></div>`;
        statsHTML += `<div class="stat-item"><span>Best Spin:</span> <span>${stats.bestSpin}</span></div>`;
        statsHTML += `<div class="stat-item"><span>Last Spin:</span> <span>${stats.lastSpin}</span></div>`;
        statsHTML += `<div class="stat-item"><span>Days Playing:</span> <span>${daysSinceFirstPlay}</span></div>`;
        statsHTML += `<div class="stat-item"><span>Global Rank:</span> <span>${userRank}</span></div>`;
        statsHTML += '</div>';
        
        // Leaderboard section
        if (leaderboard.length > 0) {
            statsHTML += '<h3>Global Leaderboard</h3>';
            statsHTML += '<div class="leaderboard-table">';
            statsHTML += '<div class="leaderboard-header">';
            statsHTML += '<span>Rank</span><span>Address</span><span>Tokens</span><span>Best Spin</span>';
            statsHTML += '</div>';
            
            leaderboard.forEach((entry, index) => {
                const userClass = entry.address === userAddress ? 'current-user' : '';
                statsHTML += `<div class="leaderboard-row ${userClass}">`;
                statsHTML += `<span>#${index + 1}</span>`;
                statsHTML += `<span>${entry.address.slice(0, 6)}...${entry.address.slice(-4)}</span>`;
                statsHTML += `<span>${entry.tokensWon}</span>`;
                statsHTML += `<span>${entry.bestSpin}</span>`;
                statsHTML += '</div>';
            });
            
            statsHTML += '</div>';
        }
        
        statsHTML += '<button class="close-button">Close</button>';
        statsHTML += '</div>';
        
        modal.innerHTML = statsHTML;
        document.body.appendChild(modal);
        
        // Add event listener to close button
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
};