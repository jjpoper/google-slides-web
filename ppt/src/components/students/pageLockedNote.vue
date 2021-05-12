<template>
  <div class="page">
    <div
      id="integrationTest_lockScreenMessage"
      class="v2screen-lock__message"
    >Your teacher has locked responses for this slide</div>

    <br />
    <div class="v2screen-lock__sub-text">Your Current Answer</div>

    <div>
        
    </div>
  </div>
</template>

<style  scoped>
.page {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.v2screen-lock__message {
  font-family: ProximaNovaSoft-SemiBold, sans-serif;
  font-weight: normal;
  font-style: normal;
  padding: 0.2em 1em;
  font-size: 1.5rem;
  text-align: center;
  color: #ffffff;
}
.v2screen-lock__sub-text {
  font-family: ProximaNovaSoft-SemiBold, sans-serif;
  font-weight: normal;
  font-style: normal;
  padding-bottom: 1em;
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
  color: #eedb44;
}
</style>

<script>
export default {};
</script>