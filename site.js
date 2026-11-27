const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

document.querySelectorAll("[data-copy]").forEach((block) => {
  const button = block.querySelector(".copy");
  if (!button) return;
  button.addEventListener("click", async () => {
    const text = block.dataset.copy || block.querySelector("pre, code").textContent;
    const ok = await copyText(text.trim());
    button.textContent = ok ? "Copied" : "Failed";
    button.classList.toggle("done", ok);
    setTimeout(() => {
      button.textContent = "Copy";
      button.classList.remove("done");
    }, 1500);
  });
});

const tabs = [...document.querySelectorAll('[role="tab"]')];

const selectTab = (tab) => {
  tabs.forEach((other) => {
    const selected = other === tab;
    other.setAttribute("aria-selected", String(selected));
    other.tabIndex = selected ? 0 : -1;
    document.getElementById(other.getAttribute("aria-controls")).hidden = !selected;
  });
};

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const next = tabs[(index + step + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// Hardcoded tag in the HTML is the fallback when the API is unreachable or rate-limited.
fetch("https://api.github.com/repos/pzpass/pzpass/releases/latest", {
  headers: { Accept: "application/vnd.github+json" },
})
  .then((response) => (response.ok ? response.json() : Promise.reject()))
  .then(({ tag_name }) => {
    if (!/^v\d+\.\d+\.\d+$/.test(tag_name)) return;
    document.querySelectorAll("[data-latest-tag]").forEach((el) => {
      el.textContent = tag_name;
    });
  })
  .catch(() => {});
