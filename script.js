const API_URL =
  "https://script.google.com/macros/s/AKfycbyeLiyXdU6aO84XXUpvnr10f2pbZHdKUKU3jbguz5Qn-SGZb-zvlBckhyyxwguzsgF8/exec";


const form =
  document.getElementById("nimForm");

const angkatanInput =
  document.getElementById("angkatan");

const namaInput =
  document.getElementById("nama");

const prodiInput =
  document.getElementById("prodi");

const tanggalLahirInput =
  document.getElementById("tanggalLahir");

const tanggalLahirDisplay =
  document.getElementById("tanggalLahirDisplay");

const btnCari =
  document.getElementById("btnCari");

const loading =
  document.getElementById("loading");

const hasil =
  document.getElementById("hasil");

const error =
  document.getElementById("error");

const nimElement =
  document.getElementById("nim");

const btnCopy =
  document.getElementById("btnCopy");

const copyMessage =
  document.getElementById("copyMessage");

const btnReset =
  document.getElementById("btnReset");


// ========================================
// DATE PICKER DISPLAY
// ========================================

tanggalLahirInput.addEventListener(
  "change",
  function() {

    if (!this.value) {

      tanggalLahirDisplay.value = "";

      return;

    }


    // Nilai input date:
    // YYYY-MM-DD

    const bagian =
      this.value.split("-");


    const tahun =
      bagian[0];

    const bulan =
      bagian[1];

    const hari =
      bagian[2];


    // Tampilkan:
    // DD/MM/YYYY

    tanggalLahirDisplay.value =
      hari + "/" + bulan + "/" + tahun;

  }
);


// ========================================
// LOAD OPTIONS
// ========================================

async function loadOptions() {

  try {

    const response =
      await fetch(API_URL);


    const data =
      await response.json();


    if (!data.success) {

      throw new Error(
        "Gagal mengambil data."
      );

    }


    isiDropdown(
      angkatanInput,
      data.angkatan,
      "Pilih Angkatan"
    );


    isiDropdown(
      prodiInput,
      data.prodi,
      "Pilih Program Studi"
    );


  } catch (err) {

    console.error(err);


    tampilkanError(
      "Daftar pilihan gagal dimuat. Silakan refresh halaman."
    );

  }

}


// ========================================
// DROPDOWN
// ========================================

function isiDropdown(
  select,
  data,
  placeholder
) {

  select.innerHTML = "";


  const optionDefault =
    document.createElement("option");


  optionDefault.value = "";


  optionDefault.textContent =
    placeholder;


  optionDefault.disabled = true;


  optionDefault.selected = true;


  select.appendChild(
    optionDefault
  );


  data.forEach(item => {

    const option =
      document.createElement("option");


    option.value =
      item;


    option.textContent =
      item;


    select.appendChild(
      option
    );

  });

}


// ========================================
// SUBMIT
// ========================================

form.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    sembunyikanSemuaPesan();


    const angkatan =
      angkatanInput.value;


    const nama =
      namaInput.value.trim();


    const prodi =
      prodiInput.value;


    const tanggalLahir =
      tanggalLahirInput.value;


    if (
      !angkatan ||
      !nama ||
      !prodi ||
      !tanggalLahir
    ) {

      tampilkanError(
        "Silakan lengkapi seluruh data terlebih dahulu."
      );

      return;

    }


    btnCari.disabled = true;


    btnCari.textContent =
      "Mencari...";


    loading.classList.remove(
      "hidden"
    );


    try {

      const response =
        await fetch(
          API_URL,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body: JSON.stringify({

              angkatan:
                angkatan,

              nama:
                nama,

              prodi:
                prodi,

              tanggalLahir:
                tanggalLahir

            })

          }
        );


      const data =
        await response.json();


      loading.classList.add(
        "hidden"
      );


      if (data.success) {

        tampilkanHasil(
          data.nim
        );

      } else {

        tampilkanError(
          data.message
        );

      }


    } catch (err) {

      console.error(err);


      loading.classList.add(
        "hidden"
      );


      tampilkanError(
        "Tidak dapat terhubung ke server. Silakan coba kembali."
      );

    }


    btnCari.disabled = false;


    btnCari.textContent =
      "Lihat NIM";

  }
);


// ========================================
// HASIL
// ========================================

function tampilkanHasil(nim) {

  hasil.classList.remove(
    "hidden"
  );


  nimElement.textContent =
    nim;


  copyMessage.textContent =
    "";


  hasil.scrollIntoView({

    behavior: "smooth",

    block: "center"

  });

}


// ========================================
// COPY NIM
// ========================================

btnCopy.addEventListener(
  "click",
  async function() {

    const nim =
      nimElement.textContent;


    try {

      await navigator.clipboard
        .writeText(nim);


      copyMessage.textContent =
        "✓ NIM berhasil disalin. Silakan tempel di WhatsApp atau Catatan.";


      btnCopy.textContent =
        "✓ NIM Tersalin";


      setTimeout(() => {

        btnCopy.textContent =
          "📋 Salin NIM";

      }, 2500);


    } catch (err) {

      const textarea =
        document.createElement(
          "textarea"
        );


      textarea.value =
        nim;


      document.body.appendChild(
        textarea
      );


      textarea.select();


      document.execCommand(
        "copy"
      );


      textarea.remove();


      copyMessage.textContent =
        "✓ NIM berhasil disalin. Silakan tempel di WhatsApp atau Catatan.";


      btnCopy.textContent =
        "✓ NIM Tersalin";


      setTimeout(() => {

        btnCopy.textContent =
          "📋 Salin NIM";

      }, 2500);

    }

  }
);


// ========================================
// RESET
// ========================================

btnReset.addEventListener(
  "click",
  function() {

    form.reset();


    tanggalLahirDisplay.value =
      "";


    hasil.classList.add(
      "hidden"
    );


    error.classList.add(
      "hidden"
    );


    copyMessage.textContent =
      "";


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }
);


// ========================================
// ERROR
// ========================================

function tampilkanError(
  message
) {

  error.textContent =
    message;


  error.classList.remove(
    "hidden"
  );


  error.scrollIntoView({

    behavior: "smooth",

    block: "center"

  });

}


// ========================================
// HIDE MESSAGE
// ========================================

function sembunyikanSemuaPesan() {

  error.classList.add(
    "hidden"
  );


  hasil.classList.add(
    "hidden"
  );


  loading.classList.add(
    "hidden"
  );


  copyMessage.textContent =
    "";

}


// ========================================
// START
// ========================================

loadOptions();
