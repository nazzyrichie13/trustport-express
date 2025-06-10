
const containers = document.querySelectorAll('.container');
  let currentIndex = 0;

  function showNext() {
    containers.forEach(container => {
      container.classList.remove('active');
      const texts = container.querySelectorAll('.image-text');
      texts.forEach(el => {
        el.classList.remove('animate', 'delay-1', 'delay-2', 'delay-3');
      });
    });

    const current = containers[currentIndex];
    current.classList.add('active');

    const texts = current.querySelectorAll('.image-text');
    texts.forEach((el, index) => {
      el.classList.add('animate', `delay-${index + 1}`);
      
    });

    currentIndex = (currentIndex + 1) % containers.length;
    setTimeout(showNext, 6000);
  };

   
  


document.addEventListener("DOMContentLoaded", () => {
  const articleParagraphs = document.querySelectorAll(".article p");
  const divItems = document.querySelectorAll(".divItem");
  const images = document.querySelectorAll(".image-article img");

  articleParagraphs.forEach((paragraph, index) => {
    paragraph.addEventListener("click", () => {
      divItems.forEach(item => item.classList.remove("item"));
      images.forEach(img => img.style.display = "none");

      if (divItems[index]) divItems[index].classList.add("item");
      if (images[index]) images[index].style.display = "block";
    });
  });

  // Show first one by default
  if (divItems[0]) divItems[0].classList.add("item");
  if (images[0]) images[0].style.display = "block";
});

const toggleSpan = document.getElementById('span_toggle');

document.addEventListener('DOMContentLoaded',() => { 
  toggleSpan.addEventListener('click',function(){
    const navbars = document.getElementById('navigate');
    navbars.classList.remove(".navigate")
    navbars.style.display = "flex";
    navbars.style.flexDirection = "column";
    navbars.style.gap = "20px";
    navbars.innerText = textContent;
  
    
    
  })
})



function removeNav() {
  const nav = document.getElementById("navigate");
  if (nav) {
    nav.style.display = "none";
  } 
}
const faqs = document.querySelectorAll('.faq');
    faqs.forEach(faq => {
      faq.addEventListener('click', () => {
        faq.classList.toggle('open');
      });
    });
    showNext();