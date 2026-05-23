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
    [
      {
        "id": "custom-1779566732582",
        "name": "Aditya Roy Chowdhury",
        "headline": "AWS Summit",
        "date": "Sep 21, 2025",
        "avatar": "assets/profile.jpg",
        "content": [
          "Last week, I attended the Amazon Web Services (AWS) Summit in Los Angeles, and it was an incredible experience!",
          "Most of my day was spent in workshops and presentations, getting hands-on with tools that could change the way we work with AI. I learned to use Amazon SageMaker and fine-tuned a Llama 3B model on a curated dataset to create an AI travel guide. I also built a RAG-based conversational search system with OpenSearch and Bedrock, and saw Marko Sluga’s demo of Amazon Q Developer, which could practically be a company’s software developer intern (under supervision, of course). The most fun, though, was creating and racing on a virtual F1 track powered by Nova. Seeing these tools in action made the potential of AI feel tangible and exciting.",
          "What made the experience even more meaningful were the people I met. I connected with passionate, talented individuals building innovative products. Hearing their stories, challenges, and approaches was as enlightening as the workshops themselves. Those conversations reminded me that innovation is not just about technology, but also the people behind it.",
          "Some key takeaways that really resonated with me:",
          "--Businesses are moving toward agentic AI, where systems act as collaborators rather than just tools.",
          "--Developers now have the opportunity to focus on ideas, strategy, and innovation, while AI handles the heavy lifting. This shift makes it possible to guide AI systems, amplify impact, and create in ways that were previously unimaginable.",
          "The summit left me energized, motivated, and grateful for the connections I made. It was a day full of learning, experimentation, and collaboration, and I look forward to applying these insights in my own projects and exploring what AI can achieve."
        ],
        "hashtags": "",
        "likes": 0,
        "image": "data:image/jpeg;base64,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",
        "linkedinUrl": "https://www.linkedin.com/posts/adityaroy12_awssummit-bedrock-rag-activity-7376015993556434944-0g8D?utm_source=share&utm_medium=member_desktop&rcm=ACoAADJ3nzkBgHGOL5xgo1JlHLsRlal48_DgF0U"
      }
    ]
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
      return JSON.parse(localStorage.getItem('portfolio_feed_likes_v2') || '{}');
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
    localStorage.setItem('portfolio_feed_likes_v2', JSON.stringify(liked));
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
        '      <span class="feed-card__reaction-icons">👍</span>' +
        '      <span class="feed-card__reaction-count">' + currentLikes + '</span>' +
        '    </div>' +
        '    <div class="feed-card__actions">' +
        '      <button type="button" class="feed-card__action-btn feed-card__like-btn ' + (isLiked ? 'is-liked' : '') + '" data-id="' + post.id + '" data-liked="' + isLiked + '" data-count="' + post.likes + '">' +
        '        <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>' +
        '        <span>Like</span>' +
        '      </button>' +
        (post.linkedinUrl ? '      <a href="' + post.linkedinUrl + '" target="_blank" rel="noopener noreferrer" class="feed-card__action-btn feed-card__linkedin-btn">' +
          '        <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>' +
          '        <span>View Post</span>' +
          '      </a>' : '') +
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

        if (file.size > 3 * 1024 * 1024) {
          alert('Image size exceeds 3MB. Please choose a smaller image to fit in browser local storage.');
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
        var linkedin = document.getElementById('postLinkedin').value.trim();
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
          image: base64Image,
          linkedinUrl: linkedin
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
