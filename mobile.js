(function() {
  if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) return;

  document.body.classList.add('touch-device');

  var canvas = document.getElementById('gameCanvas');
  var touchStartX = null;
  var touchStartY = null;
  var SWIPE_THRESHOLD = 25;

  function simulateKey(key) {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: key,
      bubbles: true,
      cancelable: true
    }));
  }

  // Canvas swipe for movement, tap for context-sensitive actions
  canvas.addEventListener('touchstart', function(e) {
    // Naming / renaming screens: use prompt() since virtual keyboards
    // don't reliably fire keydown events on mobile
    if (typeof namingActive !== 'undefined' && namingActive) {
      e.preventDefault();
      var name = prompt('Enter game name:', typeof nameInput !== 'undefined' ? nameInput : '');
      if (name !== null && name.trim()) {
        nameInput = name.substring(0, 20);
        simulateKey('Enter');
      } else {
        simulateKey('Escape');
      }
      touchStartX = null;
      return;
    }
    if (typeof renamingGameIdx !== 'undefined' && renamingGameIdx >= 0) {
      e.preventDefault();
      var newName = prompt('Rename game:', typeof nameInput !== 'undefined' ? nameInput : '');
      if (newName !== null && newName.trim()) {
        nameInput = newName.substring(0, 20);
        simulateKey('Enter');
      } else {
        simulateKey('Escape');
      }
      touchStartX = null;
      return;
    }

    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', function(e) {
    if (touchStartX === null) return;
    var t = e.changedTouches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;

    // Tap (not a swipe)
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) {
      // Extra-life choice: tap left = Yes, right = No
      if (typeof deathChoicePending !== 'undefined' && deathChoicePending) {
        var rect = canvas.getBoundingClientRect();
        simulateKey(t.clientX < rect.left + rect.width / 2 ? 'y' : 'n');
      }
      return;
    }

    // Swipe → direction key
    if (Math.abs(dx) > Math.abs(dy)) {
      simulateKey(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
    } else {
      simulateKey(dy > 0 ? 'ArrowDown' : 'ArrowUp');
    }
  });

  // On-screen button handlers
  document.querySelectorAll('#mobile-controls button[data-key]').forEach(function(btn) {
    btn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      this.classList.add('active');
      simulateKey(this.dataset.key);
    }, { passive: false });
    btn.addEventListener('touchend', function() {
      this.classList.remove('active');
    });
  });
})();
