<?php
/**
 * Buzz Cafe — Main Website
 * index.php
 */

require_once __DIR__ . '/includes/functions.php';

// Track visit
trackVisit();

// Load settings
$s        = getAllSettings();
$menu     = getMenuGrouped();
$gallery  = getGallery();
$testis   = getTestimonials();
$featured = getFeaturedItems(8);

$cafeName    = e($s['cafe_name']      ?? 'Buzz Cafe');
$tagline     = e($s['tagline']        ?? 'Where Taste Meets Vibes');
$heroTitle   = e($s['hero_title']     ?? 'Where Taste Meets Vibes');
$heroSub     = e($s['hero_subtitle']  ?? '');
$heroImg     = e($s['hero_image']     ?? 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1920');
$address     = e($s['address']        ?? '');
$phone       = e($s['phone']          ?? '');
$whatsapp    = e($s['whatsapp']       ?? '');
$hours       = e($s['hours_weekday']  ?? '8:00 AM – 10:30 PM');
$mapUrl      = e($s['google_maps_url'] ?? '#');
$rating      = e($s['google_review_rating'] ?? '4.9');
$priceRange  = e($s['price_range']    ?? '₹100 – ₹400');
$aboutText   = e($s['about_text']     ?? '');
$metaDesc    = e($s['meta_description'] ?? '');
$metaKw      = e($s['meta_keywords']   ?? '');
$instaUrl    = e($s['instagram_url']   ?? '#');
$fbUrl       = e($s['facebook_url']    ?? '#');

// Section visibility
$showMenu   = ($s['show_section_menu']         ?? '1') === '1';
$showGal    = ($s['show_section_gallery']      ?? '1') === '1';
$showTesti  = ($s['show_section_testimonials'] ?? '1') === '1';
$showRes    = ($s['show_section_reservation']  ?? '1') === '1';
$showServ   = ($s['show_section_services']     ?? '1') === '1';

// Category names for menu filters
$catNames = array_map(fn($c) => ['name' => $c['name'], 'slug' => strtolower(str_replace(' ', '-', $c['name']))], $menu);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $cafeName ?> — <?= $tagline ?> | Nashik</title>
  <meta name="description" content="<?= $metaDesc ?>">
  <meta name="keywords" content="<?= $metaKw ?>">
  <meta name="robots" content="index, follow">
  <meta name="author" content="<?= $cafeName ?>">
  <meta name="theme-color" content="#C8A96E">

  <!-- Open Graph -->
  <meta property="og:type"        content="restaurant">
  <meta property="og:title"       content="<?= $cafeName ?> — <?= $tagline ?>">
  <meta property="og:description" content="<?= $metaDesc ?>">
  <meta property="og:image"       content="<?= $heroImg ?>">
  <meta property="og:url"         content="https://buzzcafe.in">
  <meta property="og:locale"      content="en_IN">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="<?= $cafeName ?> — <?= $tagline ?>">
  <meta name="twitter:description" content="<?= $metaDesc ?>">
  <meta name="twitter:image"       content="<?= $heroImg ?>">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "<?= $cafeName ?>",
    "description": "<?= $metaDesc ?>",
    "url": "https://buzzcafe.in",
    "telephone": "+91<?= $phone ?>",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No 2/4, Thakur Avenue, Kathe Ln, Bankar Chowk, Dwarka",
      "addressLocality": "Nashik",
      "addressRegion": "Maharashtra",
      "postalCode": "422011",
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "<?= $rating ?>",
      "bestRating": "5",
      "ratingCount": "100"
    },
    "openingHours": "Mo-Su 08:00-22:30",
    "priceRange": "<?= $priceRange ?>",
    "servesCuisine": ["Indian","Continental","Cafe","Fast Food"],
    "hasMap": "<?= $mapUrl ?>"
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☕</text></svg>">
  <style>
    .spinner {
      display: inline-block; width: 14px; height: 14px;
      border: 2px solid rgba(0,0,0,0.3); border-top-color: var(--bg-primary);
      border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>

<!-- Scroll Progress -->
<div id="scroll-progress"></div>

<!-- Loader -->
<div id="loader" role="status" aria-label="Loading">
  <div class="loader-logo">BUZZ</div>
  <div class="loader-bar"><div class="loader-bar-inner"></div></div>
</div>

<!-- ══ NAVBAR ══════════════════════════════════════════════════ -->
<nav id="navbar" aria-label="Main Navigation">
  <div class="container nav-inner">
    <a href="#hero" class="nav-logo" aria-label="Buzz Cafe Home">
      <span class="nav-logo-text">BUZZ CAFE</span>
      <span class="nav-logo-sub">Nashik, Maharashtra</span>
    </a>
    <ul class="nav-links" role="list">
      <li><a href="#about">About</a></li>
      <?php if ($showServ): ?><li><a href="#services">Services</a></li><?php endif; ?>
      <?php if ($showMenu): ?><li><a href="#menu">Menu</a></li><?php endif; ?>
      <?php if ($showGal): ?><li><a href="#gallery">Gallery</a></li><?php endif; ?>
      <?php if ($showTesti): ?><li><a href="#testimonials">Reviews</a></li><?php endif; ?>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <?php if ($showRes): ?>
    <a href="#reservation" class="btn btn-primary nav-cta">Reserve a Table</a>
    <?php endif; ?>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<!-- Mobile Menu -->
<div id="nav-mobile" class="nav-mobile" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
  <a href="#about">About</a>
  <?php if ($showServ): ?><a href="#services">Services</a><?php endif; ?>
  <?php if ($showMenu): ?><a href="#menu">Menu</a><?php endif; ?>
  <?php if ($showGal): ?><a href="#gallery">Gallery</a><?php endif; ?>
  <?php if ($showTesti): ?><a href="#testimonials">Reviews</a><?php endif; ?>
  <?php if ($showRes): ?><a href="#reservation">Reserve</a><?php endif; ?>
  <a href="#contact">Contact</a>
</div>

<!-- ══ HERO ════════════════════════════════════════════════════ -->
<section id="hero" aria-label="Hero">
  <div class="hero-bg" style="background-image:url('<?= $heroImg ?>');" role="img" aria-label="Buzz Cafe interior"></div>
  <div class="hero-overlay"></div>
  <div class="container">
    <div class="hero-content">
      <div class="hero-badge">
        <span class="dot" aria-hidden="true"></span>
        Open Today · <?= $hours ?>
      </div>
      <h1 class="hero-title">
        <?= $cafeName ?><br>
        <em><?= $tagline ?></em>
      </h1>
      <p class="hero-tagline">Premium Cafe Experience</p>
      <p class="hero-desc"><?= $heroSub ?></p>
      <div class="hero-actions">
        <?php if ($showMenu): ?>
        <a href="#menu" class="btn btn-primary">
          <span>☕</span> View Menu
        </a>
        <?php endif; ?>
        <?php if ($showRes): ?>
        <a href="#reservation" class="btn btn-outline">
          <span>📅</span> Reserve a Table
        </a>
        <?php endif; ?>
      </div>
    </div>

    <div class="hero-stats" role="list">
      <div class="hero-stat" role="listitem">
        <span class="hero-stat-num"><?= $rating ?>★</span>
        <span class="hero-stat-label">Google Rating</span>
      </div>
      <div class="hero-stat" role="listitem">
        <span class="hero-stat-num"><?= $priceRange ?></span>
        <span class="hero-stat-label">Price Range</span>
      </div>
      <div class="hero-stat" role="listitem">
        <span class="hero-stat-num">Daily</span>
        <span class="hero-stat-label">Open 7 Days</span>
      </div>
    </div>
  </div>
  <div class="hero-scroll" aria-hidden="true">
    <span>Scroll</span>
    <div class="scroll-line"></div>
  </div>
</section>

<!-- ══ ABOUT ═══════════════════════════════════════════════════ -->
<section id="about" class="section" aria-label="About Buzz Cafe">
  <div class="container">
    <div class="about-grid">
      <div class="about-images reveal">
        <img
          class="about-img-main"
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop"
          alt="Buzz Cafe cozy interior"
          loading="lazy"
        >
        <img
          class="about-img-secondary"
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop"
          alt="Premium coffee at Buzz Cafe"
          loading="lazy"
        >
        <div class="about-badge-float">
          <span class="num">4.9</span>
          <span class="lbl">Google Stars</span>
        </div>
      </div>
      <div class="about-text reveal reveal-delay-2">
        <span class="section-label">Our Story</span>
        <h2 class="section-title">More Than a Cafe — <em>It's an Experience</em></h2>
        <div class="divider"></div>
        <p class="section-subtitle"><?= $aboutText ?></p>
        <div class="about-highlights" role="list">
          <div class="about-highlight" role="listitem">
            <span class="about-hl-icon">🌿</span>
            <div>
              <div class="about-hl-title">Fresh Ingredients</div>
              <div class="about-hl-text">Every dish made fresh daily with quality ingredients.</div>
            </div>
          </div>
          <div class="about-highlight" role="listitem">
            <span class="about-hl-icon">☕</span>
            <div>
              <div class="about-hl-title">Premium Beverages</div>
              <div class="about-hl-text">Handcrafted drinks for every mood and moment.</div>
            </div>
          </div>
          <div class="about-highlight" role="listitem">
            <span class="about-hl-icon">🎶</span>
            <div>
              <div class="about-hl-title">Cozy Vibes</div>
              <div class="about-hl-text">Warm ambience perfect for work or hangouts.</div>
            </div>
          </div>
          <div class="about-highlight" role="listitem">
            <span class="about-hl-icon">🚗</span>
            <div>
              <div class="about-hl-title">Drive-Through</div>
              <div class="about-hl-text">Quick service for your busy days on the go.</div>
            </div>
          </div>
        </div>
        <?php if ($showMenu): ?>
        <a href="#menu" class="btn btn-ghost" style="margin-top:36px;">
          Explore Full Menu <span class="arrow">→</span>
        </a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>

<!-- ══ SERVICES ════════════════════════════════════════════════ -->
<?php if ($showServ): ?>
<section id="services" class="section" aria-label="Our Services">
  <div class="container">
    <div class="section-header centered reveal">
      <span class="section-label">What We Offer</span>
      <h2 class="section-title">Crafted for Every Kind of Visit</h2>
      <div class="divider centered"></div>
      <p class="section-subtitle">Whether you're dining in, grabbing a quick bite on the go, or celebrating a special occasion — we have you covered.</p>
    </div>
    <div class="services-grid">
      <div class="service-card reveal reveal-delay-1">
        <div class="service-icon" aria-hidden="true">🍽️</div>
        <h3 class="service-title">Dine-In</h3>
        <p class="service-text">Enjoy your meal in our beautifully designed space with cozy lighting, comfortable seating, and a warm atmosphere that keeps you coming back.</p>
      </div>
      <div class="service-card reveal reveal-delay-2">
        <div class="service-icon" aria-hidden="true">🚗</div>
        <h3 class="service-title">Drive-Through</h3>
        <p class="service-text">Short on time? Pull up to our drive-through window and pick up your favourite food and beverages without ever leaving your car.</p>
      </div>
      <div class="service-card reveal reveal-delay-3">
        <div class="service-icon" aria-hidden="true">🛵</div>
        <h3 class="service-title">Home Delivery</h3>
        <p class="service-text">Craving Buzz at home? We deliver hot, fresh meals right to your doorstep so you never have to compromise on quality or taste.</p>
      </div>
      <div class="service-card reveal reveal-delay-4">
        <div class="service-icon" aria-hidden="true">📅</div>
        <h3 class="service-title">Table Reservation</h3>
        <p class="service-text">Planning a birthday, date, or family gathering? Book your table in advance and let us make your special occasion unforgettable.</p>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- ══ MENU ═════════════════════════════════════════════════════ -->
<?php if ($showMenu): ?>
<section id="menu" class="section" aria-label="Our Menu">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">What We Serve</span>
      <h2 class="section-title">Our Menu</h2>
      <div class="divider"></div>
      <p class="section-subtitle">From wholesome rolls to decadent desserts — every item is crafted with love and the finest ingredients.</p>
    </div>

    <!-- Filter Buttons -->
    <div class="menu-filters reveal" role="tablist" aria-label="Menu categories">
      <button class="filter-btn active" data-filter="all" role="tab">All</button>
      <?php foreach ($menu as $cat): ?>
      <button class="filter-btn" data-filter="<?= e(strtolower(str_replace(' ','-',$cat['name']))) ?>" role="tab">
        <?= e($cat['icon']) ?> <?= e($cat['name']) ?>
      </button>
      <?php endforeach; ?>
    </div>

    <!-- Categories -->
    <?php foreach ($menu as $cat): ?>
    <div class="menu-category reveal" data-category="<?= e(strtolower(str_replace(' ','-',$cat['name']))) ?>">
      <h3 class="category-title">
        <span class="cat-icon" aria-hidden="true"><?= e($cat['icon']) ?></span>
        <?= e($cat['name']) ?>
        <span class="cat-count"><?= count($cat['items']) ?> items</span>
      </h3>
      <div class="menu-grid" role="list">
        <?php foreach ($cat['items'] as $item): ?>
        <div class="menu-card" role="listitem">
          <div class="menu-card-left">
            <div class="veg-badge <?= $item['is_veg'] ? 'veg' : 'nonveg' ?>" title="<?= $item['is_veg'] ? 'Vegetarian' : 'Non-Vegetarian' ?>" aria-label="<?= $item['is_veg'] ? 'Vegetarian' : 'Non-Vegetarian' ?>"></div>
            <span class="menu-name"><?= e($item['name']) ?></span>
          </div>
          <span class="menu-price">₹<?= number_format($item['price'], 0) ?></span>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
</section>
<?php endif; ?>

<!-- ══ GALLERY ══════════════════════════════════════════════════ -->
<?php if ($showGal && !empty($gallery)): ?>
<section id="gallery" class="section" aria-label="Gallery">
  <div class="container">
    <div class="section-header centered reveal">
      <span class="section-label">Our Space</span>
      <h2 class="section-title">A Glimpse of the <em>Buzz</em></h2>
      <div class="divider centered"></div>
      <p class="section-subtitle">Every corner of Buzz Cafe tells a story. Come in and make yours.</p>
    </div>

    <div class="gallery-filters reveal" role="tablist">
      <button class="filter-btn gallery-filter-btn active" data-filter="all">All</button>
      <button class="filter-btn gallery-filter-btn" data-filter="ambience">Ambience</button>
      <button class="filter-btn gallery-filter-btn" data-filter="food">Food</button>
      <button class="filter-btn gallery-filter-btn" data-filter="beverages">Beverages</button>
    </div>

    <div class="gallery-masonry reveal" id="gallery-grid">
      <?php foreach ($gallery as $i => $img): ?>
      <div class="gallery-item" data-category="<?= e($img['category']) ?>" data-title="<?= e($img['title'] ?? '') ?>">
        <img
          src="<?= e($img['image_url']) ?>"
          alt="<?= e($img['title'] ?? 'Buzz Cafe gallery') ?>"
          loading="lazy"
        >
        <div class="gallery-item-overlay">
          <div class="gallery-zoom-icon" aria-hidden="true">🔍</div>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Lightbox -->
<div id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
  <img id="lb-img" src="" alt="Gallery image">
  <button class="lb-close" id="lb-close" aria-label="Close">✕</button>
  <button class="lb-nav lb-prev" id="lb-prev" aria-label="Previous image">‹</button>
  <button class="lb-nav lb-next" id="lb-next" aria-label="Next image">›</button>
</div>
<?php endif; ?>

<!-- ══ TESTIMONIALS ═════════════════════════════════════════════ -->
<?php if ($showTesti && !empty($testis)): ?>
<section id="testimonials" class="section" aria-label="Customer Reviews">
  <div class="container">
    <div class="section-header centered reveal">
      <span class="section-label">Happy Customers</span>
      <h2 class="section-title">What People Are Saying</h2>
      <div class="divider centered"></div>
    </div>

    <!-- Rating Highlight -->
    <div class="rating-highlight reveal">
      <div class="rating-big" aria-label="<?= $rating ?> out of 5 stars"><?= $rating ?></div>
      <div class="rating-sep" aria-hidden="true"></div>
      <div class="rating-info">
        <div class="rating-stars-row" aria-label="5 stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <div class="rating-label">Based on 100+ verified reviews</div>
        <div class="rating-platform">Powered by Google Reviews</div>
      </div>
    </div>

    <!-- Scrolling Track (doubled for infinite) -->
    <div class="testimonials-track-wrap">
      <div class="testimonials-track" id="testi-track">
        <?php
          // Double the list for seamless loop
          $allTestis = array_merge($testis, $testis);
          foreach ($allTestis as $t):
            $initials = strtoupper(substr($t['name'],0,1));
        ?>
        <article class="testi-card" aria-label="Review by <?= e($t['name']) ?>">
          <div class="testi-stars" aria-label="<?= (int)$t['rating'] ?> stars">
            <?php for ($s = 0; $s < (int)$t['rating']; $s++): ?>
            <span aria-hidden="true">★</span>
            <?php endfor; ?>
          </div>
          <blockquote class="testi-text"><?= e($t['review']) ?></blockquote>
          <div class="testi-author">
            <div class="testi-avatar" aria-hidden="true"><?= $initials ?></div>
            <div>
              <div class="testi-name"><?= e($t['name']) ?></div>
              <div class="testi-platform">
                <span>📍</span> <?= e($t['platform']) ?>
              </div>
            </div>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- ══ RESERVATION ══════════════════════════════════════════════ -->
<?php if ($showRes): ?>
<section id="reservation" class="section" aria-label="Table Reservation">
  <div class="container">
    <div class="reservation-grid">
      <div class="reservation-info reveal">
        <span class="section-label">Book Your Spot</span>
        <h2 class="section-title">Reserve Your <em>Perfect</em> Table</h2>
        <div class="divider"></div>
        <p class="section-subtitle">Plan ahead and secure your table for a seamless dining experience. For same-day bookings, call us directly.</p>
        <div class="res-details">
          <div class="res-detail-item">
            <div class="res-detail-icon" aria-hidden="true">⏰</div>
            <div>
              <div class="res-detail-label">Opening Hours</div>
              <div class="res-detail-val"><?= $hours ?> · Open Daily</div>
            </div>
          </div>
          <div class="res-detail-item">
            <div class="res-detail-icon" aria-hidden="true">📍</div>
            <div>
              <div class="res-detail-label">Location</div>
              <div class="res-detail-val"><?= $address ?></div>
            </div>
          </div>
          <div class="res-detail-item">
            <div class="res-detail-icon" aria-hidden="true">📞</div>
            <div>
              <div class="res-detail-label">Phone</div>
              <div class="res-detail-val">
                <a href="tel:+91<?= $phone ?>" style="color:var(--gold)">+91 <?= $phone ?></a>
              </div>
            </div>
          </div>
          <div class="res-detail-item">
            <div class="res-detail-icon" aria-hidden="true">💰</div>
            <div>
              <div class="res-detail-label">Price Range</div>
              <div class="res-detail-val"><?= $priceRange ?> per person</div>
            </div>
          </div>
        </div>
      </div>

      <div class="reservation-form reveal reveal-delay-2">
        <h3 class="form-title">Make a Reservation</h3>
        <form id="reservation-form" novalidate aria-label="Reservation form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="res-name">Your Name <span class="req">*</span></label>
              <input type="text" id="res-name" name="name" class="form-control" placeholder="Full Name" required autocomplete="name">
            </div>
            <div class="form-group">
              <label class="form-label" for="res-phone">Phone <span class="req">*</span></label>
              <input type="tel" id="res-phone" name="phone" class="form-control" placeholder="+91 XXXXX XXXXX" required autocomplete="tel">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="res-email">Email Address <span class="req">*</span></label>
            <input type="email" id="res-email" name="email" class="form-control" placeholder="your@email.com" required autocomplete="email">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="res-date">Date <span class="req">*</span></label>
              <input type="date" id="res-date" name="date" class="form-control" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="res-time">Time <span class="req">*</span></label>
              <select id="res-time" name="time" class="form-control" required>
                <option value="">Select Time</option>
                <option>08:00 AM</option><option>08:30 AM</option>
                <option>09:00 AM</option><option>09:30 AM</option>
                <option>10:00 AM</option><option>10:30 AM</option>
                <option>11:00 AM</option><option>11:30 AM</option>
                <option>12:00 PM</option><option>12:30 PM</option>
                <option>01:00 PM</option><option>01:30 PM</option>
                <option>02:00 PM</option><option>02:30 PM</option>
                <option>03:00 PM</option><option>03:30 PM</option>
                <option>04:00 PM</option><option>04:30 PM</option>
                <option>05:00 PM</option><option>05:30 PM</option>
                <option>06:00 PM</option><option>06:30 PM</option>
                <option>07:00 PM</option><option>07:30 PM</option>
                <option>08:00 PM</option><option>08:30 PM</option>
                <option>09:00 PM</option><option>09:30 PM</option>
                <option>10:00 PM</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="res-guests">Guests <span class="req">*</span></label>
              <select id="res-guests" name="guests" class="form-control" required>
                <option value="1">1 Person</option>
                <option value="2" selected>2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
                <option value="6">6 People</option>
                <option value="7">7 People</option>
                <option value="8">8 People</option>
                <option value="10">10 People</option>
                <option value="15">15 People</option>
                <option value="20">20 People</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="res-occasion">Occasion</label>
              <select id="res-occasion" name="occasion" class="form-control">
                <option value="">Select Occasion</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Date Night</option>
                <option>Family Gathering</option>
                <option>Business Lunch</option>
                <option>Casual Dining</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div class="form-group full">
            <label class="form-label" for="res-message">Special Requests</label>
            <textarea id="res-message" name="message" class="form-control" placeholder="Any dietary requirements, seating preferences, or special arrangements..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
            ✓ Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- ══ CONTACT ══════════════════════════════════════════════════ -->
<section id="contact" class="section" aria-label="Contact Us">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Find Us</span>
      <h2 class="section-title">Get in Touch</h2>
      <div class="divider"></div>
      <p class="section-subtitle">We'd love to hear from you. Visit us, call us, or drop us a message.</p>
    </div>
    <div class="contact-grid">
      <div class="reveal">
        <div class="contact-cards">
          <div class="contact-card">
            <div class="contact-card-icon" aria-hidden="true">📍</div>
            <div>
              <div class="contact-card-label">Address</div>
              <div class="contact-card-val"><?= $address ?></div>
            </div>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon" aria-hidden="true">📞</div>
            <div>
              <div class="contact-card-label">Phone</div>
              <div class="contact-card-val">
                <a href="tel:+91<?= $phone ?>">+91 <?= $phone ?></a>
              </div>
            </div>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon" aria-hidden="true">⏰</div>
            <div>
              <div class="contact-card-label">Hours</div>
              <div class="contact-card-val"><?= $hours ?><br>Open Every Day</div>
            </div>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon" aria-hidden="true">📧</div>
            <div>
              <div class="contact-card-label">Email</div>
              <div class="contact-card-val">
                <a href="mailto:hello@buzzcafe.in">hello@buzzcafe.in</a>
              </div>
            </div>
          </div>
        </div>

        <div class="social-links" aria-label="Social Media">
          <a href="<?= $fbUrl ?>" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="<?= $instaUrl ?>" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://wa.me/91<?= $whatsapp ?>" class="social-link" aria-label="WhatsApp" target="_blank" rel="noopener">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </a>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-wrap">
          <h3 class="contact-form-title">Send Us a Message</h3>
          <form id="contact-form" novalidate aria-label="Contact form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="c-name">Name <span class="req">*</span></label>
                <input type="text" id="c-name" name="name" class="form-control" placeholder="Your Name" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="c-phone">Phone</label>
                <input type="tel" id="c-phone" name="phone" class="form-control" placeholder="+91 XXXXX XXXXX">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="c-email">Email <span class="req">*</span></label>
              <input type="email" id="c-email" name="email" class="form-control" placeholder="your@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="c-subject">Subject</label>
              <input type="text" id="c-subject" name="subject" class="form-control" placeholder="How can we help?">
            </div>
            <div class="form-group">
              <label class="form-label" for="c-message">Message <span class="req">*</span></label>
              <textarea id="c-message" name="message" class="form-control" placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
              📨 Send Message
            </button>
          </form>
        </div>
      </div>

      <div class="reveal reveal-delay-2">
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.9!2d73.7697!3d19.9975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb4a3c5a2c1d%3A0x5e8d4e2f3a1b6c7e!2sBuzz%20Cafe!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Buzz Cafe location on Google Maps"
            aria-label="Map showing Buzz Cafe location in Nashik"
          ></iframe>
        </div>
        <div style="margin-top:24px;padding:24px;background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
          <h4 style="font-family:var(--font-display);font-size:1.1rem;color:var(--white);margin-bottom:12px;">Getting Here</h4>
          <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.7;">
            📍 Shop No 2/4, Thakur Avenue, Kathe Ln<br>
            Bankar Chowk, Dwarka, Nashik 422011<br><br>
            🚗 <strong style="color:var(--text-primary)">By Car:</strong> Ample parking available nearby<br>
            🚶 <strong style="color:var(--text-primary)">Landmark:</strong> Near Bankar Chowk, Dwarka
          </p>
          <a href="https://maps.google.com/?q=Buzz+Cafe+Nashik+422011" target="_blank" rel="noopener"
             class="btn btn-outline" style="margin-top:16px;display:inline-flex;">
            🗺️ Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══ FOOTER ═══════════════════════════════════════════════════ -->
<footer id="footer" aria-label="Site Footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#hero" class="nav-logo" style="display:inline-flex;flex-direction:column;">
          <span class="nav-logo-text">BUZZ CAFE</span>
          <span class="nav-logo-sub">Nashik, Maharashtra</span>
        </a>
        <p class="footer-desc">
          Your favourite premium cafe in Nashik. Crafting memorable experiences one cup at a time — where great taste meets great vibes.
        </p>
        <div class="social-links" aria-label="Follow us on social media">
          <a href="<?= $fbUrl ?>" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="<?= $instaUrl ?>" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://wa.me/91<?= $whatsapp ?>" class="social-link" aria-label="WhatsApp" target="_blank" rel="noopener">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </a>
        </div>
      </div>
      <div>
        <h4 class="footer-col-title">Quick Links</h4>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="#about">About Us</a>
          <?php if ($showMenu): ?><a href="#menu">Our Menu</a><?php endif; ?>
          <?php if ($showGal): ?><a href="#gallery">Gallery</a><?php endif; ?>
          <?php if ($showRes): ?><a href="#reservation">Reservations</a><?php endif; ?>
          <a href="#contact">Contact</a>
          <a href="admin/login.php" style="color:var(--text-muted);font-size:0.8rem;">Admin</a>
        </nav>
      </div>
      <div>
        <h4 class="footer-col-title">Opening Hours</h4>
        <div class="footer-hours">
          <div class="footer-hour-item">
            <span class="footer-hour-day">Monday</span>
            <span class="footer-hour-time">8:00 AM – 10:30 PM</span>
          </div>
          <div class="footer-hour-item">
            <span class="footer-hour-day">Tuesday</span>
            <span class="footer-hour-time">8:00 AM – 10:30 PM</span>
          </div>
          <div class="footer-hour-item">
            <span class="footer-hour-day">Wednesday</span>
            <span class="footer-hour-time">8:00 AM – 10:30 PM</span>
          </div>
          <div class="footer-hour-item">
            <span class="footer-hour-day">Thursday</span>
            <span class="footer-hour-time">8:00 AM – 10:30 PM</span>
          </div>
          <div class="footer-hour-item">
            <span class="footer-hour-day">Friday</span>
            <span class="footer-hour-time">8:00 AM – 10:30 PM</span>
          </div>
          <div class="footer-hour-item">
            <span class="footer-hour-day">Saturday</span>
            <span class="footer-hour-time">8:00 AM – 10:30 PM</span>
          </div>
          <div class="footer-hour-item">
            <span class="footer-hour-day">Sunday</span>
            <span class="footer-hour-time">8:00 AM – 10:30 PM</span>
          </div>
        </div>
      </div>
      <div>
        <h4 class="footer-col-title">Contact Info</h4>
        <div class="footer-links">
          <span style="color:var(--text-secondary);font-size:0.88rem;line-height:1.7;"><?= $address ?></span>
          <a href="tel:+91<?= $phone ?>" style="color:var(--gold)">📞 +91 <?= $phone ?></a>
          <a href="https://wa.me/91<?= $whatsapp ?>">💬 WhatsApp Us</a>
          <a href="mailto:hello@buzzcafe.in">✉️ hello@buzzcafe.in</a>
          <div style="margin-top:8px;display:flex;align-items:center;gap:6px;color:var(--gold);">
            <span>★★★★★</span>
            <span style="color:var(--text-secondary);font-size:0.85rem;"><?= $rating ?> Google Rating</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">
        © <?= date('Y') ?> <?= $cafeName ?>, Nashik. All Rights Reserved.
      </p>
      <div class="footer-bottom-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

<!-- ══ FLOATING WIDGETS ═════════════════════════════════════════ -->
<!-- WhatsApp -->
<a id="whatsapp-float" href="https://wa.me/91<?= $whatsapp ?>?text=Hi%20Buzz%20Cafe!%20I%20would%20like%20to%20know%20more."
   target="_blank" rel="noopener" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
</a>

<!-- Back to Top -->
<button id="back-to-top" aria-label="Back to top" title="Back to top">↑</button>

<!-- Toast Container -->
<div id="toast-container" aria-live="polite" aria-atomic="false"></div>

<script src="assets/js/script.js"></script>
</body>
</html>
