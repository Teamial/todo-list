const cloudsContainer = document.getElementById('clouds');

function createCloud() {
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');

  // Randomize size
  const size = Math.random() * 0.6 + 0.4; // Scale between 0.4x and 1x
  cloud.style.transform = `scale(${size})`;

  // Randomize position
  const topPosition = Math.random() * 100; // Vertical range within viewport
  cloud.style.top = `${topPosition}vh`;

  // Randomize animation duration
  const animationDuration = Math.random() * 20 + 30; // 20s to 50s
  cloud.style.animationDuration = `${animationDuration}s`;

  // Append cloud to container
  cloudsContainer.appendChild(cloud);

  // Remove cloud after animation ends
  setTimeout(() => {
    cloudsContainer.removeChild(cloud);
  }, animationDuration * 1000);
}

// Generate new clouds at intervals
setInterval(createCloud, 3300); // Every 3.3 seconds
