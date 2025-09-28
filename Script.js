
const form = document.getElementById("apostaForm");
const tabela = document.getElementById("tabelaApostas");
const lucroDiario = document.getElementById("lucroDiario");
const lucroSemanal = document.getElementById("lucroSemanal");
const lucroMensal = document.getElementById("lucroMensal");

let apostas = JSON.parse(localStorage.getItem("apostas")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
    const data = document.getElementById("data").value;
      const descricao = document.getElementById("descricao").value;
        const valor = parseFloat(document.getElementById("valor").value);
          const retorno = parseFloat(document.getElementById("retorno").value);
            const lucro = retorno - valor;

              apostas.push({ data, descricao, valor, retorno, lucro });
                localStorage.setItem("apostas", JSON.stringify(apostas));

                  form.reset();
                    render();
                    });

                    function render() {
                      tabela.innerHTML = "";
                        apostas.forEach((a) => {
                            const row = `<tr>
                                  <td>${a.data}</td>
                                        <td>${a.descricao}</td>
                                              <td>R$ ${a.valor.toFixed(2)}</td>
                                                    <td>R$ ${a.retorno.toFixed(2)}</td>
                                                          <td style="color:${a.lucro >= 0 ? 'green' : 'red'}">R$ ${a.lucro.toFixed(2)}</td>
                                                              </tr>`;
                                                                  tabela.innerHTML += row;
                                                                    });

                                                                      atualizarResumo();
                                                                        gerarGraficos();
                                                                        }

                                                                        function atualizarResumo() {
                                                                          const hoje = new Date().toISOString().split("T")[0];
                                                                            const semanaPassada = new Date();
                                                                              semanaPassada.setDate(semanaPassada.getDate() - 7);
                                                                                const mesAtual = new Date().getMonth();

                                                                                  let diario = 0, semanal = 0, mensal = 0;
                                                                                    apostas.forEach((a) => {
                                                                                        const data = new Date(a.data);
                                                                                            if (a.data === hoje) diario += a.lucro;
                                                                                                if (data >= semanaPassada) semanal += a.lucro;
                                                                                                    if (data.getMonth() === mesAtual) mensal += a.lucro;
                                                                                                      });

                                                                                                        lucroDiario.textContent = "R$ " + diario.toFixed(2);
                                                                                                          lucroSemanal.textContent = "R$ " + semanal.toFixed(2);
                                                                                                            lucroMensal.textContent = "R$ " + mensal.toFixed(2);
                                                                                                            }

                                                                                                            function gerarGraficos() {
                                                                                                              const ctx1 = document.getElementById("graficoDiario").getContext("2d");
                                                                                                                const ctx2 = document.getElementById("graficoAcumulado").getContext("2d");

                                                                                                                  const datas = apostas.map(a => a.data);
                                                                                                                    const lucros = apostas.map(a => a.lucro);

                                                                                                                      // Gráfico de barras (lucro/prejuízo diário)
                                                                                                                        if (window.grafico1) window.grafico1.destroy();
                                                                                                                          window.grafico1 = new Chart(ctx1, {
                                                                                                                              type: 'bar',
                                                                                                                                  data: {
                                                                                                                                        labels: datas,
                                                                                                                                              datasets: [{
                                                                                                                                                      label: 'Lucro/Prejuízo por dia',
                                                                                                                                                              data: lucros,
                                                                                                                                                                      backgroundColor: lucros.map(v => v >= 0 ? 'green' : 'red')
                                                                                                                                                                            }]
                                                                                                                                                                                }
                                                                                                                                                                                  });

                                                                                                                                                                                    // Gráfico acumulado
                                                                                                                                                                                      let acumulado = 0;
                                                                                                                                                                                        const acumulados = lucros.map(v => acumulado += v);

                                                                                                                                                                                          if (window.grafico2) window.grafico2.destroy();
                                                                                                                                                                                            window.grafico2 = new Chart(ctx2, {
                                                                                                                                                                                                type: 'line',
                                                                                                                                                                                                    data: {
                                                                                                                                                                                                          labels: datas,
                                                                                                                                                                                                                datasets: [{
                                                                                                                                                                                                                        label: 'Lucro acumulado',
                                                                                                                                                                                                                                data: acumulados,
                                                                                                                                                                                                                                        borderColor: 'blue',
                                                                                                                                                                                                                                                fill: false
                                                                                                                                                                                                                                                      }]
                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                            // Render inicial
                                                                                                                                                                                                                                                            render();
                                                                                                                                                                                                                                                            