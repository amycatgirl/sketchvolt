window.sketchpad = {};

window.sketchpad._open = false;

// TODO: SWITCH TO IFRAME AND WINDOW MESSAGE EVENTS
window.sketchpad._scriptLocations = {
  func: "https://raw.githubusercontent.com/amycatgirl/plugin-deps/main/sketchpad.js",
  templ:
    "https://raw.githubusercontent.com/amycatgirl/plugin-deps/main/sketchpadTemplate.js",
};

window.sketchpad.injectDependency = async function (type) {
  const depSource = await (
    await fetch(window.sketchpad._scriptLocations[type])
  ).text();

  const dep = document.createElement("script");
  dep.innerText = depSource;
  dep.id = `sk-${type}`;
  dep.onload = () => console.log("loaded", type);
  document.head.append(dep);
};

window.sketchpad._loadSketchpad = async function () {
  await window.sketchpad.injectDependency("templ");
  document.body.insertAdjacentHTML(
    "afterbegin",
    window.sketchpad._html.replace(/\\/g, "")
  );
  const skpd = document.querySelector("[class^='sketchpad']");
  skpd.style = `display: none; position: absolute; width: 610px; height: 600px; bottom: 0; right: 0; z-index: 10000;`;
  document
    .querySelector(".tooling > .picker")
    .insertAdjacentHTML(
      "afterend",
      "<canvas id='drawandchat' width=400 height=400></canvas>"
    );
  await window.sketchpad.injectDependency("func");
};

window.sketchpad._unloadSketchpad = function () {
  for (const key of Object.keys(window.sketchpad._scriptLocations)) {
    const dep = document.getElementById(`sk-${key}`);
    dep.remove();
  }

  const skpd = document.querySelector(".sketchpad");
  skpd.remove();
  window.sketchpad._open = false;
  SketchpadToggleObserver.disconnect();
};

window.sketchpad.toggleSketchpad = async function () {
  const skpd = document.querySelector("[class^='sketchpad']");
  switch (window.sketchpad._open) {
    case true:
      skpd.style.display = "none";
      window.sketchpad._open = false;
      break;

    case false:
      skpd.style.display = "flex";
      window.sketchpad._open = true;
      break;
  }
};

window.sketchpad.internal = {};
window.sketchpad.internal.dataURItoBlob = function (dataURI, callback) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var bb = new Blob([ab], { type: mimeString });
  return bb;
};

window.sketchpad.internal.autumnUpload = async function (blob) {
    const client = window.controllers.client.getReadyClient();
    const form = new FormData();
    console.log(blob);
    const date = new Date();
    form.append("file", blob, `sketchpadDrawing-${date.toLocaleDateString()}`);

    const res = await fetch("https://autumn.revolt.chat/attachments", {
        method: "POST",
        body: form,
        headers: {
            "X-Session-Token": client.session.token,
        }
    }).then(async (response) => await response.json());
    return res.id;
};

window.sketchpad.uploadSketchpad = async function (id, content) {
    const _ = window.location.href.split("/");
    const channelID = _[_.length - 1];

    const client = window.controllers.client.getReadyClient();
    await client.channels
    .get(channelID)
    .sendMessage({ content: content ?? "", attachments: [id] })
    .then(() => window.sketchpad.toggleSketchpad());
};

// style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
const sketchpadAction = document.createElement("div");
sketchpadAction.className = "MessageBox__Action-sc-jul4fa-2 fIbyPH";
sketchpadAction.innerHTML = `<a class='IconButton-sc-166lqkp-0 bGwznd' onclick='window.sketchpad.toggleSketchpad()'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="StyledIconBase-ea9ulj-0 bWRyML"><path d="M20 4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h4l-1.8 2.4 1.6 1.2 2.7-3.6h3l2.7 3.6 1.6-1.2L16 18h4c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 13h4v2H5v-2z"></path></svg></a>`;

const SketchpadToggleObserver = new MutationObserver((records) => {
  const box = document.querySelector("[class^='MessageBox__Base']");
  if (box && !box.contains(sketchpadAction)) box.appendChild(sketchpadAction);
});

setTimeout(() => {
  SketchpadToggleObserver.observe(
    document.querySelector("[data-component='routes']"),
    { subtree: true, childList: true }
  );
}, 5000);

window.sketchpad._loadSketchpad();

return {
  onUnload: () => window.sketchpad._unloadSketchpad(),
};
