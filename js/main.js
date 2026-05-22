(function () {
  'use strict';

  // ----- Scroll progress bar -----
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    function updateProgress() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      scrollProgress.style.width = p + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ----- Header hide on scroll down, show on scroll up -----
  var header = document.getElementById('siteHeader');
  var lastScroll = 0;
  if (header) {
    function toggleHeader() {
      var y = window.scrollY;
      if (y > 80) {
        if (y > lastScroll) header.classList.add('hidden');
        else header.classList.remove('hidden');
      } else {
        header.classList.remove('hidden');
      }
      lastScroll = y;
    }
    window.addEventListener('scroll', toggleHeader, { passive: true });
  }

  // ----- Scroll reveal (Intersection Observer) -----
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ----- Mobile nav toggle -----
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelectorAll('.nav__links a');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('nav--open'));
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Copy email -----
  var copyBtn = document.getElementById('copyEmail');
  var copyFeedback = document.getElementById('copyFeedback');
  var contactEmail = document.getElementById('contactEmail');
  if (copyBtn && copyFeedback && contactEmail) {
    copyBtn.addEventListener('click', function () {
      var email = contactEmail.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            copyFeedback.textContent = 'Copied!';
            setTimeout(function () {
              copyFeedback.textContent = '';
            }, 2000);
          },
          function () {
            copyFeedback.textContent = 'Copy failed';
          }
        );
      } else {
        copyFeedback.textContent = 'Not supported';
      }
    });
  }

  // ----- Current year in footer -----
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Expandable cards: click to expand/collapse (experience + projects) -----
  function collapseAllExpandables() {
    document.querySelectorAll('.expandable.is-expanded').forEach(function (card) {
      card.classList.remove('is-expanded');
      var hint = card.querySelector('.expandable__hint');
      if (hint) hint.textContent = 'Click to expand';
    });
  }

  document.querySelectorAll('[data-focus-section]').forEach(function (section) {
    var cards = section.querySelectorAll('.expandable');
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var isExpanded = card.classList.toggle('is-expanded');
        var hint = card.querySelector('.expandable__hint');
        if (hint) hint.textContent = isExpanded ? 'Click to collapse' : 'Click to expand';
        if (isExpanded) {
          cards.forEach(function (other) {
            if (other !== card) {
              other.classList.remove('is-expanded');
              var otherHint = other.querySelector('.expandable__hint');
              if (otherHint) otherHint.textContent = 'Click to expand';
            }
          });
        }
      });
    });
  });

  // Click outside expanded tile → collapse
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.expandable')) {
      collapseAllExpandables();
    }
  });

  // Scroll past section → collapse expanded tile in that section
  var focusSections = document.querySelectorAll('[data-focus-section]');
  if (focusSections.length && 'IntersectionObserver' in window) {
    var collapseObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            var section = entry.target;
            section.querySelectorAll('.expandable.is-expanded').forEach(function (card) {
              card.classList.remove('is-expanded');
              var hint = card.querySelector('.expandable__hint');
              if (hint) hint.textContent = 'Click to expand';
            });
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );
    focusSections.forEach(function (section) {
      collapseObserver.observe(section);
    });
  }

  // ----- Smooth scroll for anchor links (polyfill for older browsers) -----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (id === '#') return;
    var target = document.querySelector(id);
    if (target) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  // ----- Easter egg: Konami code -----
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var index = 0;
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === konami[index]) {
      index++;
      if (index === konami.length) {
        index = 0;
        document.body.classList.add('easter-egg');
        setTimeout(function () {
          document.body.classList.remove('easter-egg');
        }, 3000);
      }
    } else {
      index = 0;
    }
  });

  // ----- Dynamic Hybrid CMS Feed & Admin Modal -----
  var defaultPosts = [
    {
      id: "post-1",
      name: "Aditya Roy Chowdhury",
      headline: "ML Engineer & MS CS @ USC",
      date: "May 2026",
      avatar: "assets/profile.jpg",
      content: [
        "Official: Master of Science in Computer Science from the University of Southern California (USC)! 🎓🔴🟡",
        "Incredible 2 years of learning deep learning, advanced computer vision, and building amazing lifelong connections. Grateful for everyone who supported me throughout this journey. Next stop: Carleton University for my MASc/PhD in ECE! 🚀"
      ],
      hashtags: "#graduation #usc #fighton #computerScience",
      likes: 84,
      image: ""
    },
    {
      id: "post-2",
      name: "Aditya Roy Chowdhury",
      headline: "Incoming Graduate Student @ Carleton",
      date: "Mar 2026",
      avatar: "assets/profile.jpg",
      content: [
        "Extremely honored to receive the prestigious Vector Scholarship in Artificial Intelligence! 🏆 AI-focused research and learning is ready to be accelerated. Ready to push the boundaries of AI deployment and edge computing in Canada. 🇨🇦"
      ],
      hashtags: "#VectorScholarship #AI #machinelearning #academic",
      likes: 62,
      image: ""
    },
    {
      id: "post-3",
      name: "Aditya Roy Chowdhury",
      headline: "ML Engineer & MS CS @ USC",
      date: "Oct 2025",
      avatar: "assets/profile.jpg",
      content: [
        "Had an amazing time attending the AWS Summit! ☁️ Experienced incredible keynotes on next-generation cloud architectures, decentralized inference, and large-scale model serving.",
        "Met awesome builders and brought back fresh ideas for cloud-native deployment!"
      ],
      hashtags: "#AWS #AWSSummit #cloudComputing #MLOps",
      likes: 45,
      image: ""
    },
    {
      id: "post-4",
      name: "Aditya Roy Chowdhury",
      headline: "ML Intern @ ICTP",
      date: "Feb 2024",
      avatar: "assets/profile.jpg",
      content: [
        "Thrilled to share that I have joined the International Centre for Theoretical Physics (ICTP) in Trieste, Italy as an ML Engineer Intern! 🇮🇹",
        "Working on low-power, high-efficiency object detection pipelines optimized for FPGA hardware deployment. Experiencing Trieste's gorgeous coast is a wonderful bonus! 🌊"
      ],
      hashtags: "#internship #ICTP #edgeAI #embeddedML",
      likes: 71,
      image: ""
    }
  ];

  // Check URL query parameters for admin access (e.g. ?admin10=true)
  var urlParams = new URLSearchParams(window.location.search);
  var isAdmin = urlParams.get('admin10') === 'true';

  if (isAdmin) {
    document.body.classList.add('is-admin');
  }

  // Local storage management helpers
  function getCustomPosts() {
    try {
      return JSON.parse(localStorage.getItem('portfolio_feed_updates') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCustomPosts(posts) {
    localStorage.setItem('portfolio_feed_updates', JSON.stringify(posts));
  }

  function getDeletedDefaults() {
    try {
      return JSON.parse(localStorage.getItem('portfolio_feed_deleted_defaults') || '[]');
    } catch (e) {
      return [];
    }
  }

  function deleteDefaultPost(postId) {
    var deleted = getDeletedDefaults();
    if (deleted.indexOf(postId) === -1) {
      deleted.push(postId);
      localStorage.setItem('portfolio_feed_deleted_defaults', JSON.stringify(deleted));
    }
  }

  function getLikedPosts() {
    try {
      return JSON.parse(localStorage.getItem('portfolio_feed_likes') || '{}');
    } catch (e) {
      return {};
    }
  }

  function toggleLike(postId) {
    var liked = getLikedPosts();
    var isLikedNow = false;
    if (liked[postId]) {
      delete liked[postId];
    } else {
      liked[postId] = true;
      isLikedNow = true;
    }
    localStorage.setItem('portfolio_feed_likes', JSON.stringify(liked));
    return isLikedNow;
  }

  // Toast Notification
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-active');
    setTimeout(function () {
      toast.classList.remove('is-active');
    }, 3000);
  }

  // Dynamic Feed Render
  var feedPostsContainer = document.getElementById('feedPosts');

  function renderFeed() {
    if (!feedPostsContainer) return;

    var customPosts = getCustomPosts();
    var deletedDefaults = getDeletedDefaults();
    var likedPosts = getLikedPosts();

    // Filter default posts by active ones
    var activeDefaults = defaultPosts.filter(function (post) {
      return deletedDefaults.indexOf(post.id) === -1;
    });

    // Combine custom and default posts (custom newest on top)
    var allPosts = customPosts.concat(activeDefaults);

    if (allPosts.length === 0) {
      feedPostsContainer.innerHTML = '<div style="text-align:center; padding:var(--space-lg); color:var(--text-muted); font-size:0.875rem;">No updates yet.</div>';
      return;
    }

    var html = '';
    allPosts.forEach(function (post) {
      var isLiked = likedPosts[post.id] ? true : false;
      var currentLikes = isLiked ? (post.likes + 1) : post.likes;

      // Handle content paragraphs
      var contentHTML = '';
      if (Array.isArray(post.content)) {
        post.content.forEach(function (p) {
          contentHTML += '<p>' + p + '</p>';
        });
      } else {
        contentHTML = '<p>' + post.content + '</p>';
      }

      // Handle hashtags
      var hashtagsHTML = '';
      if (post.hashtags) {
        hashtagsHTML = '<span class="feed-card__hashtags">' + post.hashtags + '</span>';
      }

      // Handle image
      var imageHTML = '';
      if (post.image) {
        imageHTML = '<div class="feed-card__img-container"><img class="feed-card__img" src="' + post.image + '" alt="Update image" loading="lazy" /></div>';
      }

      // Delete Button HTML (Admin view only)
      var deleteButtonHTML = '';
      if (isAdmin) {
        deleteButtonHTML = '<button type="button" class="feed-card__delete-btn" data-id="' + post.id + '" title="Delete this post">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>' +
          'Delete' +
          '</button>';
      }

      html += '<article class="feed-card">' +
        '  <div class="feed-card__header">' +
        '    <img class="feed-card__avatar" src="' + (post.avatar || 'assets/profile.jpg') + '" alt="' + post.name + '" />' +
        '    <div class="feed-card__meta">' +
        '      <span class="feed-card__name">' + post.name + '</span>' +
        '      <span class="feed-card__headline">' + post.headline + '</span>' +
        '      <span class="feed-card__date">' + post.date + '</span>' +
        '    </div>' +
        deleteButtonHTML +
        '  </div>' +
        '  <div class="feed-card__body">' +
        contentHTML +
        imageHTML +
        hashtagsHTML +
        '  </div>' +
        '  <div class="feed-card__footer">' +
        '    <div class="feed-card__reactions">' +
        '      <span class="feed-card__reaction-icons">👍❤️</span>' +
        '      <span class="feed-card__reaction-count">' + currentLikes + '</span>' +
        '    </div>' +
        '    <div class="feed-card__actions">' +
        '      <button type="button" class="feed-card__action-btn feed-card__like-btn ' + (isLiked ? 'is-liked' : '') + '" data-id="' + post.id + '" data-liked="' + isLiked + '" data-count="' + post.likes + '">' +
        '        <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>' +
        '        <span>Like</span>' +
        '      </button>' +
        '      <button type="button" class="feed-card__action-btn">' +
        '        <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>' +
        '        <span>Comment</span>' +
        '      </button>' +
        '    </div>' +
        '  </div>' +
        '</article>';
    });

    feedPostsContainer.innerHTML = html;

    // Attach Likes Event Listeners
    feedPostsContainer.querySelectorAll('.feed-card__like-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var postId = btn.getAttribute('data-id');
        var baseCount = parseInt(btn.getAttribute('data-count'), 10);
        var currentLiked = toggleLike(postId);

        btn.setAttribute('data-liked', currentLiked ? 'true' : 'false');
        btn.classList.toggle('is-liked', currentLiked);

        var countEl = btn.closest('.feed-card').querySelector('.feed-card__reaction-count');
        if (countEl) {
          countEl.textContent = currentLiked ? (baseCount + 1) : baseCount;
        }

        // Add pop animation on active
        var icon = btn.querySelector('.action-icon');
        if (icon) {
          icon.style.transform = 'scale(1.25) rotate(-8deg)';
          icon.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          setTimeout(function () {
            icon.style.transform = '';
          }, 150);
        }
      });
    });

    // Attach Delete Event Listeners (Admin only)
    if (isAdmin) {
      feedPostsContainer.querySelectorAll('.feed-card__delete-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var postId = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this update?')) {
            if (postId.indexOf('post-') === 0) {
              deleteDefaultPost(postId);
            } else {
              var custom = getCustomPosts();
              custom = custom.filter(function (p) { return p.id !== postId; });
              saveCustomPosts(custom);
            }
            renderFeed();
            showToast('Milestone deleted successfully');
          }
        });
      });
    }
  }

  // Initialize Feed
  renderFeed();

  // ----- Admin GUI Form Logic -----
  if (isAdmin) {
    var adminModal = document.getElementById('adminModal');
    var addPostBtn = document.getElementById('addPostBtn');
    var closeModalBtn = document.getElementById('closeModalBtn');
    var cancelPostBtn = document.getElementById('cancelPostBtn');
    var exportFeedBtn = document.getElementById('exportFeedBtn');
    var addPostForm = document.getElementById('addPostForm');

    var postImageInput = document.getElementById('postImage');
    var imagePreviewContainer = document.getElementById('imagePreviewContainer');
    var imagePreview = document.getElementById('imagePreview');
    var removeImageBtn = document.getElementById('removeImageBtn');

    var base64Image = '';

    // Open Modal
    if (addPostBtn && adminModal) {
      addPostBtn.addEventListener('click', function () {
        adminModal.classList.add('is-active');
        adminModal.setAttribute('aria-hidden', 'false');
      });
    }

    // Close Modal helpers
    function closeModal() {
      if (adminModal) {
        adminModal.classList.remove('is-active');
        adminModal.setAttribute('aria-hidden', 'true');
        addPostForm.reset();
        base64Image = '';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
        if (imagePreview) imagePreview.src = '';
      }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelPostBtn) cancelPostBtn.addEventListener('click', closeModal);

    // Click outside modal to close
    if (adminModal) {
      adminModal.addEventListener('click', function (e) {
        if (e.target === adminModal) closeModal();
      });
    }

    // Image Upload to Base64 Reader
    if (postImageInput) {
      postImageInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;

        if (file.size > 1.5 * 1024 * 1024) {
          alert('Image size exceeds 1.5MB. Please choose a smaller image to fit in browser local storage.');
          postImageInput.value = '';
          return;
        }

        var reader = new FileReader();
        reader.onload = function (evt) {
          base64Image = evt.target.result;
          if (imagePreview) imagePreview.src = base64Image;
          if (imagePreviewContainer) imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      });
    }

    // Remove Uploaded Image
    if (removeImageBtn) {
      removeImageBtn.addEventListener('click', function () {
        base64Image = '';
        if (postImageInput) postImageInput.value = '';
        if (imagePreview) imagePreview.src = '';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
      });
    }

    // Handle Form Submit
    if (addPostForm) {
      addPostForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var headline = document.getElementById('postHeadline').value.trim();
        var date = document.getElementById('postDate').value.trim();
        var rawContent = document.getElementById('postContent').value.trim();
        var hashtags = document.getElementById('postHashtags').value.trim();

        // Split paragraphs by newline
        var contentArray = rawContent.split('\n').filter(function (p) {
          return p.trim().length > 0;
        });

        var newPost = {
          id: 'custom-' + Date.now(),
          name: 'Aditya Roy Chowdhury',
          headline: headline,
          date: date,
          avatar: 'assets/profile.jpg',
          content: contentArray,
          hashtags: hashtags,
          likes: 0,
          image: base64Image
        };

        var customPosts = getCustomPosts();
        customPosts.unshift(newPost); // newest first
        saveCustomPosts(customPosts);

        closeModal();
        renderFeed();
        showToast('Milestone posted successfully!');
      });
    }

    // Export Feed JSON to Clipboard
    if (exportFeedBtn) {
      exportFeedBtn.addEventListener('click', function () {
        var customPosts = getCustomPosts();
        var deletedDefaults = getDeletedDefaults();

        // Get active default posts
        var activeDefaults = defaultPosts.filter(function (post) {
          return deletedDefaults.indexOf(post.id) === -1;
        });

        // Combined data
        var allActivePosts = customPosts.concat(activeDefaults);
        var jsonStr = JSON.stringify(allActivePosts, null, 2);

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(jsonStr).then(function () {
            showToast('JSON feed data copied to clipboard!');
          }, function () {
            alert('Failed to copy. Copying from console.');
            console.log(jsonStr);
          });
        } else {
          alert('Clipboard not supported. Outputting JSON in console.');
          console.log(jsonStr);
        }
      });
    }
  }
})();
