import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import './App.css'

const planData = [
  {
    id: 'arcade',
    name: 'Arcade',
    monthly: 9,
    yearly: 90,
    icon: 'arcade',
    tagline: '2 months free',
  },
  {
    id: 'advance',
    name: 'Advance',
    monthly: 12,
    yearly: 120,
    icon: 'advance',
    tagline: '2 months free',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 15,
    yearly: 150,
    icon: 'pro',
    tagline: '2 months free',
  },
]

const addOnData = [
  {
    id: 'online',
    name: 'Online Services',
    description: 'Access to multiplayer games',
    monthly: 1,
    yearly: 10,
  },
  {
    id: 'storage',
    name: 'Larger Storage',
    description: 'Extra 1TB of cloud save',
    monthly: 2,
    yearly: 20,
  },
  {
    id: 'profile',
    name: 'Customizable Profile',
    description: 'Custom theme on your profile',
    monthly: 2,
    yearly: 20,
  },
]

const stepLabels = ['YOUR INFO', 'SELECT PLAN', 'ADD-ONS', 'SUMMARY']

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [billing, setBilling] = useState('monthly')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [formValues, setFormValues] = useState({
    userName: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})

  const selectedPlanDetails =
    planData.find((plan) => plan.id === selectedPlan) || null

  const total = useMemo(() => {
    const planPrice = selectedPlanDetails
      ? billing === 'monthly'
        ? selectedPlanDetails.monthly
        : selectedPlanDetails.yearly
      : 0

    const addonPrice = selectedAddOns.reduce((sum, addonId) => {
      const addon = addOnData.find((item) => item.id === addonId)
      if (!addon) return sum
      return sum + (billing === 'monthly' ? addon.monthly : addon.yearly)
    }, 0)

    return planPrice + addonPrice
  }, [billing, selectedAddOns, selectedPlanDetails])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '', plan: '' }))
  }

  const validateStepOne = () => {
    const nextErrors = {}

    if (!formValues.userName.trim()) {
      nextErrors.userName = 'Enter your name'
    }

    if (!formValues.email.trim()) {
      nextErrors.email = 'Enter email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = 'Enter valid email'
    }

    if (!formValues.phone.trim()) {
      nextErrors.phone = 'Enter your mobile number'
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  const validatePlan = () => {
    if (!selectedPlan) {
      setErrors((prev) => ({ ...prev, plan: 'Please select a plan' }))
      return false
    }
    return true
  }

  const toggleAddOn = (addonId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId)
        ? prev.filter((item) => item !== addonId)
        : [...prev, addonId],
    )
  }

  const handleNext = () => {
    if (currentStep === 0) {
      if (!validateStepOne()) return
    }

    if (currentStep === 1) {
      if (!validatePlan()) return
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
      return
    }

    setCurrentStep(4)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const renderStepOne = () => (
    <section className="step-panel" aria-label="Step 1">
      <Typography className="step-number-label">Step 1</Typography>
      <Typography variant="h3" className="main-title">
        Personal info
      </Typography>
      <Typography className="subtitle">
        Please provide your name, email address, and phone number.
      </Typography>

      <Box component="form" noValidate className="form-box">
        <Box className="field-group">
          <Typography className="label">Name</Typography>
          <TextField
            name="userName"
            value={formValues.userName}
            onChange={updateField}
            placeholder="e.g. Stephen King"
            fullWidth
            variant="outlined"
            error={Boolean(errors.userName)}
            helperText={errors.userName || ''}
            className="custom-input"
          />
        </Box>

        <Box className="field-group">
          <Typography className="label">Email Address</Typography>
          <TextField
            name="email"
            value={formValues.email}
            onChange={updateField}
            placeholder="e.g. stephenking@lorem.com"
            fullWidth
            variant="outlined"
            error={Boolean(errors.email)}
            helperText={errors.email || ''}
            className="custom-input"
          />
        </Box>

        <Box className="field-group">
          <Typography className="label">Phone Number</Typography>
          <TextField
            name="phone"
            value={formValues.phone}
            onChange={updateField}
            placeholder="e.g. +1 234 567 890"
            fullWidth
            variant="outlined"
            error={Boolean(errors.phone)}
            helperText={errors.phone || ''}
            className="custom-input"
          />
        </Box>
      </Box>

      <div className="button-row right-align">
        <Button id="next-button" variant="contained" onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </section>
  )

  const renderStepTwo = () => (
    <section className="step-panel" aria-label="Step 2">
      <Typography className="step-number-label">Step 2</Typography>
      <Typography variant="h3" className="main-title">
        Select your plan
      </Typography>
      <Typography className="subtitle">
        You have the option of monthly or yearly billing.
      </Typography>

      <Box className="billing-toggle">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={billing === 'monthly' ? 'toggle-label active' : 'toggle-label'}>
            Monthly
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={billing === 'yearly'}
                onChange={() =>
                  setBilling((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))
                }
                color="primary"
              />
            }
            label=""
          />
          <Typography className={billing === 'yearly' ? 'toggle-label active' : 'toggle-label'}>
            Yearly
          </Typography>
        </Stack>
      </Box>

      <Box className="plan-grid">
        {planData.map((plan) => (
          <Card
            key={plan.id}
            className={`plan_card ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => {
              setSelectedPlan(plan.id)
              setErrors((prev) => ({ ...prev, plan: '' }))
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setSelectedPlan(plan.id)
                setErrors((prev) => ({ ...prev, plan: '' }))
              }
            }}
          >
            <CardContent>
              <Box className="plan-card-icon" data-plan={plan.icon} />
              <Typography variant="h6">{plan.name}</Typography>
              <Typography className="plan-price">
                ${billing === 'monthly' ? plan.monthly : plan.yearly}/{billing === 'monthly' ? 'mo' : 'yr'}
              </Typography>
              {billing === 'yearly' && (
                <Typography className="plan-tagline">{plan.tagline}</Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {errors.plan && <Typography className="field-error plan-error">{errors.plan}</Typography>}

      <div className="button-row">
        <Button type="button" className="back-button" onClick={handleBack}>
          Go Back
        </Button>
        <Button id="next-button" variant="contained" onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </section>
  )

  const renderStepThree = () => (
    <section className="step-panel" aria-label="Step 3">
      <Typography className="step-number-label">Step 3</Typography>
      <Typography variant="h3" className="main-title">
        Pick add-ons
      </Typography>
      <Typography className="subtitle">
        Add-ons help enhance your gaming experience.
      </Typography>

      <Box className="addon-list">
        {addOnData.map((addon) => {
          const isSelected = selectedAddOns.includes(addon.id)

          return (
            <label
              key={addon.id}
              className={`addon_card ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                className="addon-toggle-input"
                checked={isSelected}
                onChange={() => toggleAddOn(addon.id)}
              />
              <Box className="addon-check">{isSelected ? '✓' : ''}</Box>
              <Box className="addon-copy">
                <Typography className="addon-name">{addon.name}</Typography>
                <Typography className="addon-desc">{addon.description}</Typography>
              </Box>
              <Typography className="addon-price">
                +${billing === 'monthly' ? addon.monthly : addon.yearly}/{billing === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </label>
          )
        })}
      </Box>

      <div className="button-row">
        <Button type="button" className="back-button" onClick={handleBack}>
          Go Back
        </Button>
        <Button id="next-button" variant="contained" onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </section>
  )

  const renderStepFour = () => (
    <section className="step-panel" aria-label="Step 4">
      <Typography className="step-number-label">Step 4</Typography>
      <Typography variant="h3" className="main-title">
        Finishing up
      </Typography>
      <Typography className="subtitle">
        Double-check everything looks correct before confirming.
      </Typography>

      <Box className="summary-panel">
        <Box className="summary-plan-row">
          <Box>
            <Typography className="summary-plan-name">
              {selectedPlanDetails?.name} ({billing === 'monthly' ? 'Monthly' : 'Yearly'})
            </Typography>
            <Typography className="summary-change">Change</Typography>
          </Box>
          <Typography className="summary-plan-price">
            ${billing === 'monthly' ? selectedPlanDetails?.monthly : selectedPlanDetails?.yearly}/
            {billing === 'monthly' ? 'mo' : 'yr'}
          </Typography>
        </Box>

        <Divider className="summary-divider" />

        {selectedAddOns.length === 0 ? (
          <Typography className="summary-empty">No add-ons selected</Typography>
        ) : (
          <Stack spacing={2} className="summary-addon-list">
            {selectedAddOns.map((addonId) => {
              const addon = addOnData.find((item) => item.id === addonId)
              if (!addon) return null
              return (
                <Box key={addon.id} className="summary-addon-row">
                  <Typography>{addon.name}</Typography>
                  <Typography>
                    +${billing === 'monthly' ? addon.monthly : addon.yearly}/{billing === 'monthly' ? 'mo' : 'yr'}
                  </Typography>
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>

      <Box className="summary-total-row">
        <Typography>Total (per {billing === 'monthly' ? 'month' : 'year'})</Typography>
        <Typography className="summary-total-price">
          ${total}/{billing === 'monthly' ? 'mo' : 'yr'}
        </Typography>
      </Box>

      <div className="button-row">
        <Button type="button" className="back-button" onClick={handleBack}>
          Go Back
        </Button>
        <Button id="next-button" variant="contained" onClick={handleNext}>
          Confirm
        </Button>
      </div>
    </section>
  )

  const renderThankYou = () => (
    <section className="step-panel thank-you-panel" aria-label="Thank you">
      <Box className="thank-you-icon">✓</Box>
      <Typography variant="h3" className="main-title">
        Thank You!
      </Typography>
      <Typography className="subtitle">
        Thanks for confirming your subscription. We hope you have fun using our platform.
      </Typography>
    </section>
  )

  const renderCurrentStep = () => {
    if (currentStep === 0) return renderStepOne()
    if (currentStep === 1) return renderStepTwo()
    if (currentStep === 2) return renderStepThree()
    if (currentStep === 3) return renderStepFour()
    return renderThankYou()
  }

  return (
    <div className="page-shell">
      <div className="form-card">
        <aside className="sidebar">
          <div className="sidebar-steps">
            {stepLabels.map((label, index) => (
              <div
                key={label}
                className={`step-item ${currentStep === index ? 'active' : ''}`}
              >
                <div className="step-index">{index + 1}</div>
                <div className="step-copy">
                  <span className="step-tag">STEP {index + 1}</span>
                  <span className="step-title">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="content-panel">{renderCurrentStep()}</main>
      </div>
    </div>
  )
}

export default App
