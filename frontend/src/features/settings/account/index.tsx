import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Profile'
      desc='Update your profile settings. Set your preferred language and
          timezone.'
    >
      <AccountForm />
    </ContentSection>
  )
}
