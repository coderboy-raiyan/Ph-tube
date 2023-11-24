// All the elements I need
const categorySection = document.querySelector(".cate-container");
const videoContentArea = document.querySelector(".video-content-area");
const videoSection = document.querySelector("#video-section");
const videoNotFound = document.querySelector(".video-not-found");
const loader = document.querySelector(".loader");

// parse time
function parseTime(timestamps) {
  d = Number(timestamps);

  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);

  const hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins ") : "";

  if (d) {
    return hDisplay + mDisplay;
  }
  return "";
}

// load All categories
async function loadCategories() {
  try {
    const request = await fetch(
      "https://openapi.programming-hero.com/api/videos/categories"
    );
    const response = await request.json();
    const { data } = await response;
    categorySection.innerHTML = data
      .map(function (category, idx) {
        return (element = `<button onclick="handleVideoContent(${category?.category_id}, ${idx})" class="default-btn cate-btn  py-[6px]">${category?.category}</button>`);
      })
      .join("");
    handleVideoContent(data[0]?.category_id, 0);
  } catch (error) {
    console.log(error);
  }
}

async function handleVideoContent(id, idx) {
  categorySection.childNodes.forEach((child) => {
    child.classList.remove("bg-red-500");
    child.classList.remove("text-white");
  });

  categorySection.childNodes[idx].classList.add("bg-red-500");
  categorySection.childNodes[idx].classList.add("text-white");

  loader.style.display = "flex";
  videoContentArea.innerHTML = "";
  setTimeout(async () => {
    try {
      const request = await fetch(
        `https://openapi.programming-hero.com/api/videos/category/${id}`
      );
      const response = await request.json();
      const { data } = await response;
      if (data.length) {
      }
      if (!data.length) {
        videoContentArea.innerHTML = ` <div
          class="video-not-found col-span-4 min-h-[300px] justify-center items-center flex-col gap-y-6 text-3xl font-bold flex"
        >
          <img src="./imgs/Icon.png" alt="" />
          <h1 class="lg:w-[28%] md:w-[28%] w-full mx-auto text-center">
            Oops!! Sorry, There is no content here
          </h1>
        </div>`;
      } else {
        videoContentArea.innerHTML = data
          .map((vid) => {
            return ` <div class="video-card">
         <div class="relative">
              <img
              class="rounded-xl w-full lg:h-[200px] md:h-[200px] md:w-[312px] lg:w-[312px]"
              src="${vid?.thumbnail}"
              alt=""
              />
             ${
               parseTime(vid?.others?.posted_date) &&
               ` <span class="absolute bottom-[10px] py-1 px-2 rounded-md bg-[#171717] text-[12px] text-[#fff] right-[10px]">
                  ${parseTime(vid?.others?.posted_date)}
                </span>`
             }
         </div>
    
          <div class="video-info flex gap-x-4 my-2">
           <div class="avatar">
              <div class="w-10 h-10 rounded-full">
                  <img
                  loading="lazy"
                  class="profile-img"
                  src="${vid?.authors[0]?.profile_picture}"
                  alt=""
                  />
              </div>
           </div>
    
            <div class="video-details flex flex-col gap-y-2">
              <p class="font-semibold text-[#171717]">
                ${vid?.title}
              </p>
              <div class="user-profile flex gap-x-2">
                <h3 class="text-[#171717B2] text-[14px] font-medium">
                  ${vid?.authors[0]?.profile_name}
                </h3>
                <img
                  src="./imgs/verified.png"
                  alt=""
                  class="verified-icon w-5 h-5"
                />
              </div>
              <p class="views text-[#171717B2] text-[14px] font-medium">
                ${vid?.others?.views} views
              </p>
            </div>
          </div>
        </div>`;
          })
          .join("");
      }

      loader.style.display = "none";
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, 1000);
}

loadCategories();
