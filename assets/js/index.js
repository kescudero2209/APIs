document.getElementById("valueCLP").value = "";
      document.getElementById("select").value = "";
      const baseURL = "https://mindicador.cl/api/";
      let graphics = null; //para poder romper el gráfico más adelante

      //funcion principal
      async function getData() {
        try {
          const selectMoney = document.querySelector("#select");
          currency = selectMoney.value;
          const resp = await fetch(`${baseURL}${currency}`);
          const data = await resp.json();
          console.log("data", data);
          const arrayData = data.serie.slice(0, 10); //extraigo los 10 primeros datos
          let mapping = arrayData.map((date) => date.fecha.slice(0, 10));
          let value = arrayData.map((money) => money.valor);
          console.log("mapping", arrayData);
          console.log("valor", value);
          chart(mapping, value);

          return data;
        } catch (e) {
          console.error(e);
          alert("No pudimos resolver tu petición");
          return {};
        }
      }
      //función para el cambio de monedas
      function templateChange(data) {
        const valueCLP = document.querySelector("#valueCLP");

        if (isNaN(valueCLP.value) == true) {
          alert("Favor ingresar solo numeros");
          document.getElementById("valueCLP").value = "";
          document.getElementById("select").value = "";

          graphics.destroy(); //evita que salga el grafico en pantalla
        }
        const rounded = valueCLP.value / data.serie[0].valor
console.log(rounded.toFixed(2));
        return `
        <h3>
            <p>Resultado: ${rounded.toFixed(2)}</p>
        </h3>`;
      }

      //función para el gráfico
      function chart(mapping, value) {
        const $graphic = document.querySelector("#graphic").getContext("2d");
        if (graphics != null) {
          graphics.destroy();
        }

        graphics = new Chart($graphic, {
          type: "bar",
          data: {
            labels: mapping,
            datasets: [
              {
                label: currency,
                data: value,
                backgroundColor: "#ffffff73", // Fondo del gráfico
              },
            ],
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
      }

      //actualiza todo en el DOM
      const btn = document.querySelector("#btn");
      btn.addEventListener("click", async (event) => {
        const content = document.querySelector("#final");

        const data = await getData();
        content.innerHTML = templateChange(data);
      });