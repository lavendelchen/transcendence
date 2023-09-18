<script setup>
</script>

<template>
    <p id="highScore">
        Highscore: 3000p
    </p>
    <section class="logo">
      Ping&#160;&#160;&#160;&#160;&#160;&#160;&#160; <br>
      Pang <br>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;Pong
    </section>
    <!-- <img src="http://via.placeholder.com/800x300" alt=""> -->
    <a href="https://api.">
      <div class="buttonLogin">
        Login
      </div>
    </a>
    <p class="copyrightFooter">
        &#169; The PingPangPong Company 2023 <br>
        All rights reserved
    </p>
</template>

<style scoped>

a:link {
  color: white;
  text-decoration: none;
}


@font-face {
    font-family: textfont;
    src: url('~@/assets/fonts/Pixeled.ttf');
}
@font-face {
  font-family: logofont;
  src: url('~@/assets/fonts/8-bit-Out.ttf');
}

section {
  font-size: var(--font-size-xxxl);
  letter-spacing: 0px;
  line-height: calc(30px + 5vw);
  width: 100%%;
  text-align: center;
  text-align: center;
  margin-top: 10vh;

  
  
}

.logo {
  font-family: 'Logofont';
}

body {
  font-family: 'textfont', sans-serif;
}

p {
  font-family: 'textfont', sans-serif;
}

    img {
      width: 800px;
      display: block;
      margin: 20vh auto 0 auto;
    }

    p {
      text-align: center;
    }

    div.buttonLogin {
      display: block;
      margin: 10vh auto 0 auto;
      width: 100px;
      border: 1px solid white;
      text-align: center;
      padding: 10px 20px;
    }

    .copyrightFooter {
        position: fixed;
        bottom: 0;
        display: block;
        left: 30vw;
        width: 40vw;
    }
</style>