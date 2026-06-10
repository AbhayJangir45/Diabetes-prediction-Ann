document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('predict-form')
  const gender = document.getElementById('gender')
  const pregnanciesField = document.querySelector('.pregnancies-field')
  const pregnanciesInput = document.getElementById('pregnancies')
  const btn = document.getElementById('predict-btn')
  const spinner = document.getElementById('spinner')
  const resultBox = document.getElementById('result')

  function updatePregnanciesVisibility(){
    const isMale = gender.value === 'Male'
    pregnanciesField.classList.toggle('hidden', isMale)
    pregnanciesInput.required = !isMale
    pregnanciesInput.value = isMale ? '0' : pregnanciesInput.value || '0'
  }

  function showSpinner(on){
    spinner.classList.toggle('hidden', !on)
    btn.disabled = on
  }

  function showError(message){
    resultBox.className='result negative'
    resultBox.innerHTML = `<span class="status">Error:</span> ${message}`
    resultBox.classList.remove('hidden')
  }

  gender.addEventListener('change', updatePregnanciesVisibility)
  updatePregnanciesVisibility()

  form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const formData = new FormData(form)
    const data = {}

    formData.forEach((value, key)=>{
      data[key] = value
    })

    if(data.Gender === 'Male'){
      data.Pregnancies = '0'
    }

    const numericFields = ['Pregnancies','Glucose','BloodPressure','SkinThickness','Insulin','BMI','DiabetesPedigreeFunction','Age']
    for(const key of numericFields){
      if(data[key] === undefined || data[key] === '' || data[key] === null){
        showError(`${key} is required`) 
        return
      }
      if(isNaN(Number(data[key]))){
        showError(`${key} must be a number`)
        return
      }
    }

    resultBox.classList.add('hidden')
    try{
      showSpinner(true)
      const res = await fetch('/predict', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      })
      const json = await res.json()
      if(json.error){
        showError(json.error || 'Prediction failed')
        return
      }
      const payload = {input:data, response:json}
      sessionStorage.setItem('diabetesPrediction', JSON.stringify(payload))
      window.location.href = '/result'
    }catch(err){
      showError(err.message)
    }finally{showSpinner(false)}
  })
})
