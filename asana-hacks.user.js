// ==UserScript==
// @name			Asana hacks
// @namespace		https://github.com/fredpiuma/asana-hacks
// @version			4.0
// @description		Asana hacks user script.
// @author			Frederico de Castro - http://www.fredericodecastro.com.br
// @match			https://app.asana.com/*
// @grant			none
// ==/UserScript==

;(function (w) {
  'use strict'

  /* configure as you wish */
  var config = {
    auto_clean_tasks: true,
    format_dates_to_number: false,
    auto_load_more_subtaskas: true,
    hide_favorites: false
  }

  window._getCurrentTaskId = function () {
    let regex = /app.asana.com\/0\/(?:search\/)?[0-9]+\/([0-9]+)/
    let id = false
    if (regex.test(window.location.href)) {
      id = regex.exec(window.location.href)[1]
    }
    return id
  }

  window._dismissAlerts = function (callback) {
    if (document.querySelectorAll('.ToastNotificationContent').length > 1) {
      let notifications = Array.from(document.querySelectorAll('.ToastNotificationContent')).slice(0, -2)
      for (let notification of notifications) {
        notification.querySelector('.ToastNotificationContent-close').click()
      }
    }
  }

  setInterval(function () {
    const completionButton = document.querySelector('.TaskCompletionToggleButton')

    const buttonsRow = document.querySelector('.SingleTaskPaneToolbarAnimation-row')

    if (document.querySelector('.SingleTaskPaneToolbarAnimation-feedbackLink'))
      document.querySelector('.SingleTaskPaneToolbarAnimation-feedbackLink').remove()

    /**
     * Styles
     */
    if (!document.querySelector('.fred-style')) {
      let style = document.createElement('style')
      style.setAttribute('class', 'fred-style')
      style.innerHTML = `
		  .small-feed-story-group .feed-story .delete, .FeedMiniStory-deleteButton {visibility: visible;}
		  .SubtaskTaskRow-detailsButton.SubtaskTaskRow-detailsButton--hasMetadata {color: #000;fill: #000;visibility: visible;border-radius: 10px;background: #eee;height:24px;}
		  .SubtaskTaskRow-detailsButton:hover {color: #000;fill: #000;}
		  .btn-time {margin-left: 5px;font-size: 15px;border-color: white!important;padding: 0 0 !important;min-width: 0;height:30px;cursor:pointer;}
		  .btn-info {background: #0078d7;color: white;border-radius: 4px;line-height: 30px;padding: 0 5px !important;}
		  body .FeedMiniStoryDeleteButton {opacity: 1;}
		  `
      document.body.appendChild(style)
    }

    /*This option make a cleanup on history of changes every 500ms*/
    if (config.auto_clean_tasks) {
      if (
        (document.querySelector('.AssigneeToken-userNameLabel') &&
          document.querySelector('.AssigneeToken-userNameLabel').innerText == 'Frederico') ||
        (document.querySelector('.TaskPaneAssigneeToken') &&
          document.querySelector('.TaskPaneAssigneeToken').innerText.includes('Adicionar')) ||
        (document.querySelector('.TaskPaneAssigneeToken') &&
          document.querySelector('.TaskPaneAssigneeToken').innerText.includes('Nenhum responsável'))
      ) {
        console.log('aqui')
        document.querySelectorAll('.FeedMiniStory .XMiniIcon').forEach((el) => {
          el.parentNode.click()
        })
      }
    }

    /*Auto click on Load more subtasks*/
    if (config.auto_load_more_subtaskas) {
      let buttons = document.querySelectorAll('.SubtaskGrid-loadMore')
      if (buttons.length > 0) buttons[0].click()
    }

    /**
     * This option format the dates on all Asana to DD/MM format.
     * Works with dates like Yesterday, Tomorrow, Wednesday and DD MMM (12 Aug)
     */
    if (config.format_dates_to_number) {
      var datas = document.querySelectorAll('.grid_due_date, .DueDate, .DueDate-dateSpan')
      for (let data of datas) {
        /* se não tem tags dentro e se já não está no formato correto */
        if (data.childElementCount === 0 && !/[0-9]{2}\/[0-9]{2}/.test(data.innerHTML)) {
          console.log(data.innerHTML)
          if (/([0-9]{1,2}) ([a-zA-Z]{3})/.test(data.innerHTML)) {
            var date = /([0-9]{1,2}) ([a-zA-Z]{3})/.exec(data.innerHTML)
            console.log(date)
            var month = {
              Jan: '01',
              jan: '01',
              Jan: '01',
              Feb: '02',
              fev: '02',
              Fev: '02',
              Mar: '03',
              mar: '03',
              Mar: '03',
              Apr: '04',
              abr: '04',
              Abr: '04',
              May: '05',
              mai: '05',
              Mai: '05',
              Jun: '06',
              jun: '06',
              Jun: '06',
              Jul: '07',
              jul: '07',
              Jul: '07',
              Aug: '08',
              ago: '08',
              Ago: '08',
              Sep: '09',
              set: '09',
              Set: '09',
              Oct: '10',
              out: '10',
              Out: '10',
              Nov: '11',
              nov: '11',
              Nov: '11',
              Dec: '12',
              dez: '12',
              Dez: '12'
            }
            data.innerHTML = (date[1].length == 1 ? '0' : '') + date[1] + '/' + month[date[2]]
          } else {
            var date = new Date()
            var addDays = 0
            var weekDay = 0
            var dataStr = data.innerHTML.toLowerCase()
            if (dataStr == 'yesterday') addDays = -1
            else if (dataStr == 'ontem') addDays = -1
            else if (dataStr == 'today') addDays = 0
            else if (dataStr == 'hoje') addDays = 0
            else if (dataStr == 'tomorrow') addDays = 1
            else if (dataStr == 'amanhã') addDays = 1
            else {
              switch (dataStr) {
                case 'sunday':
                case 'monday':
                case 'tuesday':
                case 'wednesday':
                case 'thursday':
                case 'friday':
                case 'saturday':
                case 'domingo':
                case 'segunda-feira':
                case 'terça-feira':
                case 'quarta-feira':
                case 'quinta-feira':
                case 'sexta-feira':
                case 'sábado':
                case 'Domingo':
                case 'Segunda-feira':
                case 'Terça-feira':
                case 'Quarta-feira':
                case 'Quinta-feira':
                case 'Sexta-feira':
                case 'Sábado':
                  addDays = date.getDay()
                  switch (dataStr) {
                    case 'sunday':
                    case 'domingo':
                    case 'Domingo':
                      weekDay = 0
                      break
                    case 'monday':
                    case 'segunda-feira':
                    case 'Segunda-feira':
                      weekDay = 1
                      break
                    case 'tuesday':
                    case 'terça-feira':
                    case 'Terça-feira':
                      weekDay = 2
                      break
                    case 'wednesday':
                    case 'quarta-feira':
                    case 'Quarta-feira':
                      weekDay = 3
                      break
                    case 'thursday':
                    case 'quinta-feira':
                    case 'Quinta-feira':
                      weekDay = 4
                      break
                    case 'friday':
                    case 'sexta-feira':
                    case 'Sexta-feira':
                      weekDay = 5
                      break
                    case 'saturday':
                    case 'sábado':
                    case 'Sábado':
                      weekDay = 6
                      break
                  }
                  if (weekDay < addDays) {
                    weekDay += 7
                  }
                  addDays = weekDay - addDays
              }
            }
            date.setDate(date.getDate() + addDays)
            data.innerHTML =
              (date.getDate() < 10 ? '0' : '') +
              date.getDate() +
              '/' +
              (date.getMonth() + 1 < 10 ? '0' : '') +
              (date.getMonth() + 1)
          }
        }
      }
    }
  }, 500)

  setInterval(window._dismissAlerts, 300)
})(window)
