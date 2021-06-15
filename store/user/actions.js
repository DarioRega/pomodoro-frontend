import {
  USER_CREATE_POMODORO_SETTINGS_URL,
  USER_SETTINGS_URL,
  USER_UPDATE_POMODORO_SETTINGS_ID_URL,
} from '@/constantes/api'

export default {
  async updateSettings({ dispatch }, payload) {
    const notification = {
      title: this.$i18n.t('Settings edited !'),
      type: 'success',
    }
    try {
      await this.$axios.post(USER_SETTINGS_URL, payload)
    } catch (err) {
      notification.title = this.$i18n.t('Oups...')
      notification.type = 'error'
      notification.description = err.response.data.message
    } finally {
      dispatch('globalState/createNotification', notification, {
        root: true,
      })
    }
  },

  async updatePomodoroSettings({ dispatch }, payload) {
    const notification = {
      title: this.$i18n.t('Pomodoro configuration edited !'),
      type: 'success',
    }
    try {
      await this.$axios.post(
        USER_UPDATE_POMODORO_SETTINGS_ID_URL(payload.id),
        payload
      )
    } catch (err) {
      notification.title = this.$i18n.t('Oups...')
      notification.type = 'error'
      notification.description = err.response.data.message
    } finally {
      dispatch('globalState/createNotification', notification, {
        root: true,
      })
    }
  },

  async createPomodoroSettings({ dispatch }, payload) {
    const notification = {
      title: this.$i18n.t('Pomodoro configuration created !'),
      type: 'success',
    }
    delete payload.id
    try {
      const { data } = await this.$axios.post(
        USER_CREATE_POMODORO_SETTINGS_URL,
        payload
      )
      await dispatch('updateUserPomodoroSettingsChoice', data.id)
    } catch (err) {
      notification.title = this.$i18n.t('Oups...')
      notification.type = 'error'
      notification.description = err.response.data.message
    } finally {
      dispatch('globalState/createNotification', notification, {
        root: true,
      })
    }
  },
}
