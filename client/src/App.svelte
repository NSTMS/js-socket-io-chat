<script>
  import {io} from "socket.io-client"
  import { writable } from "svelte/store";
  let usr ="";
  let name ="";
  const IP = "192.168.88.67"
  let load = true;
  let message;
  let messages = writable([])
  let enable = true;
  const socket = io(`http://${IP}:3000`)
  socket.on("connect", ()=>{
    usr = socket.id;
  })
  socket.on('recive-message', (id,m)=>{
    messages.update(existingMessages => [...existingMessages, `${id}: ${m}`]);
  })
  socket.on('enable-messages', ()=>{
    enable = true;
  })

  socket.on('disable-messages', (id,m)=>{
    enable = false;
  })


  socket.on('name-changed', n =>{
    usr = n;
    load = false;
  })
  const sumbitMessage = () =>{
    socket.emit('send-message', message);
    message = "";
  }

  const changeName = () =>{
    socket.emit('change-name',name)
  }

</script>



<main>
  {#if load}
    <h2>change name</h2>
    <input type="text" name="name" id="name" bind:value={name}>
    <button type="button" on:click={changeName}>set</button>
  {:else}
  <h2>client</h2>
  <p>usr: {usr}</p>
 
  {#each $messages as msg}
    <p>{msg}</p>
  {/each}
  {#if enable}
  <input type="text" name="input" id="input" bind:value={message}>
  <button type="button" on:click={sumbitMessage}>send</button>
{/if}
  {/if}
</main>