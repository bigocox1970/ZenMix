export const scrollToSection = (e, sectionId) => {
  e.preventDefault();
  console.log('Scrolling to section:', sectionId);
  
  // If we're not on the homepage, navigate there first
  if (window.location.pathname !== '/') {
    window.location.href = `/#${sectionId}`;
    return;
  }

  // Give the DOM a moment to ensure all elements are rendered
  setTimeout(() => {
    const section = document.getElementById(sectionId);
    console.log('Found section:', section);
    
    if (section) {
      // Account for fixed header height
      const headerHeight = 80; // Adjust this value based on your header height
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      console.log('Scrolled to section');
    } else {
      console.log('Section not found');
      
      // Fallback: try to find the section by various selectors
      const fallbackSelectors = [
        `[data-section="${sectionId}"]`,
        `.section-${sectionId}`,
        `section[id*="${sectionId}"]`,
        `div[id*="${sectionId}"]`
      ];
      
      const fallbackSection = fallbackSelectors
        .map(selector => document.querySelector(selector))
        .find(element => element);
      
      console.log('Fallback section:', fallbackSection);
      
      if (fallbackSection) {
        const headerHeight = 80;
        const elementPosition = fallbackSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        console.log('Scrolled to fallback section');
      }
    }
  }, 100);
};

// Add data-section attributes to sections
export const initializeSections = () => {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    if (section.id) {
      section.setAttribute('data-section', section.id);
    }
  });
};

// Handle hash links on page load
export const handleInitialScroll = () => {
  const hash = window.location.hash;
  if (hash) {
    const sectionId = hash.slice(1);
    setTimeout(() => {
      scrollToSection(new Event('click'), sectionId);
    }, 500); // Wait for page to load
  }
};