const ItemTypes = {
  Meta: 0,
  Basic: 1
}

document.getElementById("test").onclick = function() {
  console.log(timeline);
}

function load()
{
  // Set title
  document.getElementById("title").innerText = timeline.meta.title;
  
  timeline.items.forEach(function (item) {
   console.log(item.name);
   
  });
}