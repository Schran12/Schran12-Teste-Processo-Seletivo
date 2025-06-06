document.addEventListener("DOMContentLoaded", () => {
  // --- Dark Mode Toggle ---
  // Pega o botão para ativar/desativar o modo escuro
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  // Referência ao elemento body para alterar classes
  const body = document.body;

  // Função para definir o tema (dark ou light)
  const setTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-mode"); // adiciona classe para modo escuro
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // muda ícone para lua
      localStorage.setItem("theme", "dark"); // salva preferência no localStorage
    } else {
      body.classList.remove("dark-mode"); // remove classe do modo escuro
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // muda ícone para sol
      localStorage.setItem("theme", "light"); // salva preferência no localStorage
    }
  };

  // Tenta recuperar tema salvo no localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme); // aplica tema salvo
  } else {
    // Se não tiver salvo, detecta preferência do sistema (dark mode)
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  // Evento de clique no botão para alternar entre temas
  darkModeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      setTheme("light"); // se já está no modo escuro, muda para claro
    } else {
      setTheme("dark"); // se está no claro, muda para escuro
    }
  });

  // --- Hamburger Menu ---
  // Pega o botão hamburguer e o menu de navegação
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  // Evento para abrir/fechar o menu hamburguer
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active"); // adiciona/remove classe que mostra menu
    hamburger.classList.toggle("active"); // anima ícone hamburguer
  });

  // Fecha o menu ao clicar em links de ancoragem dentro do menu (em telas pequenas)
  navMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      // Se largura da tela for <= 768px ou link não está em submenu, fecha menu
      if (window.innerWidth <= 768 || !link.closest(".has-submenu-parent")) {
        navMenu.classList.remove("active"); // fecha menu
        hamburger.classList.remove("active"); // anima ícone hamburguer
      }
    });
  });

  // --- Carousel ---
  // Seleciona elementos do carrossel
  const carouselTrack = document.querySelector(".carousel-track");
  const carouselSlides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".carousel-btn.prev-btn");
  const nextBtn = document.querySelector(".carousel-btn.next-btn");
  let currentSlideIndex = 0; // índice do slide atual
  let carouselInterval; // variável para o intervalo automático

  // Atualiza posição do carrossel, movendo o track para mostrar o slide atual
  const updateCarouselPosition = () => {
    if (carouselSlides.length === 0) return; // se não houver slides, sai
    const slideWidth = carouselSlides[0].clientWidth; // largura de um slide
    carouselTrack.style.transform = `translateX(-${
      currentSlideIndex * slideWidth
    }px)`; // move o track para esquerda conforme índice
  };

  // Avança para o próximo slide, com looping
  const showNextSlide = () => {
    currentSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;
    updateCarouselPosition();
  };

  // Volta para o slide anterior, com looping
  const showPrevSlide = () => {
    currentSlideIndex =
      (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
    updateCarouselPosition();
  };

  // Inicia o autoplay do carrossel com intervalo de 4 segundos
  const startCarousel = () => {
    clearInterval(carouselInterval); // limpa intervalo anterior para evitar sobreposição
    carouselInterval = setInterval(showNextSlide, 4000);
  };

  // Se o carrossel principal existir, pausa autoplay ao passar o mouse e retoma ao sair
  const heroCarousel = document.querySelector(".hero-carousel");
  if (heroCarousel) {
    heroCarousel.addEventListener("mouseenter", () =>
      clearInterval(carouselInterval)
    );
    heroCarousel.addEventListener("mouseleave", startCarousel);
  }

  // Botões para avançar e voltar slides com reinício do autoplay
  prevBtn.addEventListener("click", () => {
    showPrevSlide();
    startCarousel();
  });

  nextBtn.addEventListener("click", () => {
    showNextSlide();
    startCarousel();
  });

  // Atualiza posição do carrossel ao redimensionar a janela
  window.addEventListener("resize", updateCarouselPosition);

  // Inicializa o carrossel se houver slides
  if (carouselSlides.length > 0) {
    updateCarouselPosition();
    startCarousel();
  }

  // --- Fade-in Scroll ---
  // Seletor dos elementos que receberão o efeito fade-in quando aparecerem na tela
  const sectionsToObserve = document.querySelectorAll(
    ".section-padding, .hero-carousel"
  );

  // Opções para o Intersection Observer
  const observerOptions = {
    root: null, // viewport do navegador
    rootMargin: "0px", // sem margem extra
    threshold: 0.1, // 10% do elemento visível para ativar
  };

  // Callback do Intersection Observer que adiciona classe 'appear' ao entrar na viewport
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear"); // adiciona classe para animar
        observer.unobserve(entry.target); // para de observar depois de aparecer
      }
    });
  }, observerOptions);

  // Inicia a observação dos elementos para o fade-in
  sectionsToObserve.forEach((section) => {
    observer.observe(section);
  });

  // --- Botão topo ---
  // Pega o botão para voltar ao topo da página
  const backToTopButton = document.getElementById("back-to-top");

  // Mostra o botão ao rolar a página para baixo mais de 400px
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // Ao clicar no botão, faz scroll suave até o topo da página
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

