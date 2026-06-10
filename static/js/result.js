document.addEventListener('DOMContentLoaded', ()=>{
  const stored = sessionStorage.getItem('diabetesPrediction')
  if(!stored){
    window.location.href = '/'
    return
  }

  const payload = JSON.parse(stored)
  const {input, response} = payload
  const text = document.getElementById('prediction-text')
  const detail = document.getElementById('detail-list')

  if(response.error){
    text.textContent = 'Prediction failed: ' + response.error
    return
  }

  const probability = Number(response.probability)
  const percent = (probability * 100).toFixed(1)
  const label = response.prediction === 'diabetic' ? 'High risk of diabetes' : 'Lower diabetes risk'
  text.innerHTML = `<strong>${label}</strong> — ${percent}% probability`

  const details = [
    ['Gender', input.Gender],
    ['Pregnancies', input.Pregnancies],
    ['Glucose', input.Glucose],
    ['Blood Pressure', input.BloodPressure],
    ['Skin Thickness', input.SkinThickness],
    ['Insulin', input.Insulin],
    ['BMI', input.BMI],
    ['Pedigree Function', input.DiabetesPedigreeFunction],
    ['Age', input.Age],
  ]
  detail.innerHTML = details.map(([key,value])=>`<div class="detail-row"><span>${key}</span><strong>${value}</strong></div>`).join('')

  const ctx = document.getElementById('probabilityChart')
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Diabetes risk', 'Remaining'],
      datasets: [{
        data: [probability * 100, 100 - probability * 100],
        backgroundColor: ['#4f46e5', '#e5e7eb'],
        borderWidth: 0,
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        tooltip: {enabled:false},
        legend: {display:false},
        title: {display:true, text:`${percent}%`}
      }
    }
  })

  const featureLabels = ['Glucose','BMI','Blood Pressure','Insulin','Age']
  const featureValues = [
    Number(input.Glucose),
    Number(input.BMI),
    Number(input.BloodPressure),
    Number(input.Insulin),
    Number(input.Age),
  ]
  const barCtx = document.getElementById('featureChart')
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: featureLabels,
      datasets: [{
        label: 'Value',
        data: featureValues,
        backgroundColor: [
          'rgba(79,70,229,0.9)',
          'rgba(16,185,129,0.9)',
          'rgba(59,130,246,0.9)',
          'rgba(234,88,12,0.9)',
          'rgba(236,72,153,0.9)'
        ]
      }]
    },
    options: {
      responsive:true,
      maintainAspectRatio:false,
      scales: {
        y: {beginAtZero:true}
      },
      plugins: {
        legend: {display:false}
      }
    }
  })

  // Patient vs Healthy comparison chart
  const compareLabels = ['Glucose','BMI','Blood Pressure','Age']
  const patientVals = [Number(input.Glucose), Number(input.BMI), Number(input.BloodPressure), Number(input.Age)]
  const healthyVals = [99, 24.9, 80, 45]
  const compareCtx = document.getElementById('compareChart')
  new Chart(compareCtx, {
    type: 'bar',
    data: {
      labels: compareLabels,
      datasets: [
        {
          label: 'Patient',
          data: patientVals,
          backgroundColor: ['rgba(79,70,229,0.9)','rgba(79,70,229,0.8)','rgba(79,70,229,0.7)','rgba(79,70,229,0.6)']
        },
        {
          label: 'Healthy Limit',
          data: healthyVals,
          backgroundColor: ['rgba(16,185,129,0.9)','rgba(16,185,129,0.8)','rgba(16,185,129,0.7)','rgba(16,185,129,0.6)']
        }
      ]
    },
    options: {
      responsive:true,
      maintainAspectRatio:false,
      scales: { y: { beginAtZero:true } },
      plugins: { legend: { position: 'top' } },
      interaction: { mode: 'index', intersect: false }
    }
  })
})
