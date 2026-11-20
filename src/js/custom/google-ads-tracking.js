/**
 * JYSKREN - Google Ads & Analytics Conversion Tracking Helper
 * - Google Consent Mode v2 synchronization with cookie compliance banner
 * - Form submission handling & conversion event dispatch (`generate_lead`)
 * - Click-to-call (`click_to_call`) tracking
 * - Click-to-email (`click_to_email`) tracking
 */
(function() {
  'use strict';

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  // 1. Sync EU Cookie Compliance with Google Consent Mode v2
  function updateConsentFromCookie() {
    var hasAgreed = document.cookie.indexOf('cookie-agreed=2') !== -1;
    if (hasAgreed) {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
      window.dataLayer.push({
        'event': 'consent_update',
        'consent_status': 'granted'
      });
    } else if (document.cookie.indexOf('cookie-agreed=0') !== -1) {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
    }
  }

  // Check on load
  updateConsentFromCookie();

  // Listen for clicks on the cookie banner buttons
  document.addEventListener('click', function(e) {
    var target = e.target;
    if (!target) return;
    if (target.classList && (target.classList.contains('agree-button') || target.classList.contains('eu-cookie-compliance-secondary-button'))) {
      setTimeout(updateConsentFromCookie, 100);
    } else if (target.classList && (target.classList.contains('decline-button') || target.classList.contains('eu-cookie-compliance-default-button'))) {
      setTimeout(updateConsentFromCookie, 100);
    }
  });

  // 2. Track Click-to-Call
  document.addEventListener('click', function(e) {
    var anchor = e.target.closest('a[href^="tel:"]');
    if (anchor) {
      var phone = anchor.getAttribute('href').replace('tel:', '');
      var eventData = {
        event: 'click_to_call',
        phone_number: phone,
        link_text: anchor.innerText.trim(),
        page_location: window.location.href
      };
      window.dataLayer.push(eventData);
      gtag('event', 'click_to_call', {
        'phone_number': phone,
        'event_category': 'Engagement',
        'event_label': phone
      });
    }
  });

  // 3. Track Click-to-Email
  document.addEventListener('click', function(e) {
    var anchor = e.target.closest('a[href^="mailto:"]');
    if (anchor) {
      var email = anchor.getAttribute('href').replace(/^mailto:/i, '').split('?')[0];
      var eventData = {
        event: 'click_to_email',
        email_address: email,
        link_text: anchor.innerText.trim(),
        page_location: window.location.href
      };
      window.dataLayer.push(eventData);
      gtag('event', 'click_to_email', {
        'email_address': email,
        'event_category': 'Engagement',
        'event_label': email
      });
    }
  });

  // 4. Form Submission & Enhanced Conversions Support
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;

    // Read form values for conversion data
    var nameInput = form.querySelector('input[name="name"]');
    var phoneInput = form.querySelector('input[name="telefon"]');
    var emailInput = form.querySelector('input[name="email"]');
    var postnrInput = form.querySelector('input[name="postnr[postal_code]"]');
    var byInput = form.querySelector('input[name="by[city]"]');
    var messageInput = form.querySelector('textarea[name="message"]');

    var leadData = {
      event: 'generate_lead',
      form_id: form.id || 'contact_form',
      form_destination: form.action || window.location.pathname,
      lead_type: 'Quote Request',
      postal_code: postnrInput ? postnrInput.value.trim() : '',
      city: byInput ? byInput.value.trim() : ''
    };

    // Google Enhanced Conversions user_data object
    if (emailInput && emailInput.value) {
      leadData.user_data = {
        email: emailInput.value.trim().toLowerCase(),
        phone_number: phoneInput ? phoneInput.value.trim() : '',
        address: {
          postal_code: postnrInput ? postnrInput.value.trim() : '',
          city: byInput ? byInput.value.trim() : '',
          country: 'DK'
        }
      };
    }

    // Push standard GA4 / Google Ads conversion event
    window.dataLayer.push(leadData);
    gtag('event', 'generate_lead', leadData);

    // If on a static setup or non-ajax environment, redirect to /tak/ after dispatching event
    if (form.getAttribute('action') === '/' || form.getAttribute('action') === '/kontakt' || form.getAttribute('action').includes(window.location.pathname)) {
      e.preventDefault();
      setTimeout(function() {
        window.location.href = '/tak/';
      }, 250);
    }
  });

  // 5. If landing on /tak/, dispatch conversion confirmation event
  if (window.location.pathname === '/tak/' || window.location.pathname === '/tak') {
    window.dataLayer.push({
      event: 'conversion_thank_you_page',
      page_location: window.location.href
    });
    gtag('event', 'conversion', {
      'send_to': 'default',
      'event_category': 'Lead',
      'event_label': 'Thank You Page'
    });
  }

})();
