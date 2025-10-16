
  let dots = [];
  let colors = ["#F7ECA3", "#FF8E72", "#7EAEC2", "#CAA6C2", "#F45646"];
  let numDots = 25;
  let draggingDot = null;
  let startTime;
  let dotsVisible = true;
  let fadingOut = false;

  function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("illustrationCanvas");
    noStroke();
    startTime = millis();

    for (let i = 0; i < numDots; i++) {
      dots.push({
        color: random(colors),
        x: random(width),
        y: random(height),
        baseSize: random(60, 150),
        lifeOffset: random(TWO_PI),
        highlight: false,
        alpha: 200,
      });
    }
  }

  function draw() {
    clear();
    let t = millis() / 1000;

    for (let d of dots) {
      if (!dotsVisible) {
        d.alpha = max(0, d.alpha - 5);
      } else if (d.alpha < 200) {
        d.alpha = min(200, d.alpha + 3);
      }

      let breathing = sin(t * 1.5 + d.lifeOffset) * 25;
      let size = d.baseSize + breathing;

      if (draggingDot !== d) {
        d.x += sin(t * 0.8 + d.lifeOffset) * 0.3;
        d.y += cos(t * 0.8 + d.lifeOffset) * 0.3;
      }

      let fade = (sin(t * 0.5 + d.lifeOffset) + 1) / 2;
      let alpha = map(fade, 0, 1, 60, d.alpha);

      if (d.highlight) alpha = 255;

      fill(color(d.color)._getRed(), color(d.color)._getGreen(), color(d.color)._getBlue(), alpha);
      ellipse(d.x, d.y, size);
    }
  }

  function mousePressed() {
    for (let d of dots) {
      let distToMouse = dist(mouseX, mouseY, d.x, d.y);
      if (distToMouse < d.baseSize / 2) {
        draggingDot = d;
        d.highlight = true;
        return;
      }
    }

    dots.push({
      color: random(colors),
      x: mouseX,
      y: mouseY,
      baseSize: random(60, 150),
      lifeOffset: random(TWO_PI),
      highlight: false,
      alpha: 200,
    });
  }

  function mouseDragged() {
    if (draggingDot) {
      draggingDot.x = mouseX;
      draggingDot.y = mouseY;
    }
  }

  function mouseReleased() {
    if (draggingDot) {
      draggingDot.highlight = false;
      draggingDot = null;
    }
  }


  let scrollTimeout = null;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      for (let d of dots) {
        d.baseSize = max(20, d.baseSize - 10);
        d.alpha = max(0, d.alpha - 30);
      }
    }, 2000);
  });


  const human = document.getElementById("humanImg");
  human.addEventListener("click", (e) => {
    if (!fadingOut) {
      fadingOut = true;
      human.classList.add("faded");
      dotsVisible = false;

      setTimeout(() => {
        human.classList.remove("faded");
        dotsVisible = true;
        fadingOut = false;
      }, 4000);
    }
    e.stopPropagation();
  });

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
