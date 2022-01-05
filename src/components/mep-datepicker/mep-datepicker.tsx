import { Component, Element, h, Prop, State } from '@stencil/core'
import { ClickOutside } from 'stencil-click-outside'
import moment from 'moment-timezone'

//https://momentjs.com/docs/#/displaying/format/

@Component({
  tag: 'mep-datepicker',
  styleUrl: 'mep-datepicker.scss',
})
export class MepDatepicker {

  @Element() $el: HTMLElement

  @Prop() name: string
  @Prop() label: string
  @Prop({ attribute: 'from-name' }) fromName: string
  @Prop({ attribute: 'to-name' }) toName: string
  @Prop() placeholder: string = 'Select Date...'
  @Prop({ attribute: 'timezone' }) timezone: string = moment.tz.guess()
  @Prop({ attribute: 'disp-format' }) displayFormat: string = 'DD-MMM-YYYY'
  @Prop({ attribute: 'data-format' }) dataFormat: string = 'x'
  @Prop({ mutable: true }) value: any
  @Prop({ attribute: 'from-value' }) fromValue: any
  @Prop({ attribute: 'to-value' }) toValue: any
  @Prop({ attribute: 'is-range' }) isRange: boolean = false
  @Prop() separator: string = ' - '
  @Prop({ attribute: 'disable-past' }) disablePast: boolean = false
  @Prop({ attribute: 'disable-future' }) disableFuture: boolean = false
  @Prop({ attribute: 'max-range' }) maxRange: number
  @Prop({ attribute: 'with-time' }) withTime: boolean = false

  @State() showPicker: boolean = false
  @State() dateValue: any = null
  @State() selectedDates: any = []
  @State() hoverItem: any = {}

  fromHour: HTMLSelectElement
  fromMin: HTMLSelectElement
  fromAMPM: HTMLSelectElement
  toHour: HTMLSelectElement
  toMin: HTMLSelectElement
  toAMPM: HTMLSelectElement

  componentWillLoad() {
    if (this.isRange) {
      const fromVal = this.value && !isNaN(this.fromValue) ? parseInt(this.fromValue) : this.fromValue
      const toVal = this.toValue && !isNaN(this.toValue) ? parseInt(this.toValue) : this.toValue
      this.dateValue = fromVal ? moment(fromVal, this.dataFormat) : null
      if (fromVal && toVal) {
        this.selectedDates.push(moment(fromVal, this.dataFormat))
        this.selectedDates.push(moment(toVal, this.dataFormat))
      }
    } else {
      this.value = this.value && !isNaN(this.value) ? parseInt(this.value) : this.value
      this.dateValue = this.value ? moment(this.value, this.dataFormat) : null
      this.selectedDates = [this.dateValue]
    }
  }
  componentDidLoad() {
    const eventClear = (event: CustomEvent) => {
      if (!event.detail.value) {
        this.selectedDates = []
        this.dateValue = null
      }
    }
    this.name && this.$el.querySelector(`[name=${this.name}]`).addEventListener('value-changed', eventClear)
    !this.name && this.fromName && this.$el.querySelector(`[name=${this.fromName}]`).addEventListener('value-changed', eventClear)
    !this.name && this.toName && this.$el.querySelector(`[name=${this.toName}]`).addEventListener('value-changed', eventClear)
    if (this.withTime) {
      if (this.isRange) {
        this.fromHour.value = this.selectedDates[0].format('hh')
        this.fromMin.value = this.selectedDates[0].format('mm')
        this.fromAMPM.value = this.selectedDates[0].format('A')
        this.toHour.value = this.selectedDates[1].format('hh')
        this.toMin.value = this.selectedDates[1].format('mm')
        this.toAMPM.value = this.selectedDates[1].format('A')
      } else {
        this.fromHour.value = this.dateValue.format('hh')
        this.fromMin.value = this.dateValue.format('mm')
        this.fromAMPM.value = this.dateValue.format('A')
      }
    }
  }


  get today() {
    return moment(moment.now()).tz(this.timezone)
  }
  get displayDate() {
    return this.selectedDates.map(date => date ? date.format(this.displayFormat) : '').join(this.separator)
  }
  get fromMonthYearDisplay() {
    return this.fromCurrentDate.format('MMMM, YYYY')
  }
  get toMonthYearDisplay() {
    return this.toCurrentDate.format('MMMM, YYYY')
  }
  get fromCurrentDate() {
    return this.dateValue || this.today
  }
  get toCurrentDate() {
    return moment(this.fromCurrentDate).add(1, 'month')
  }
  get fromFirstDay() {
    return moment(this.fromCurrentDate).date(1)
  }
  get toFirstDay() {
    return moment(this.toCurrentDate).date(1)
  }
  get selectedValues() {
    //return this.selectedDates.map((date, i) => date ? (i === 0 ? date.startOf('date').format(this.dataFormat) : date.endOf('date').format(this.dataFormat)) : null)
    return this.selectedDates.map((date, i) => {
      if (this.withTime && this.fromMin) {
        if (i === 0) {
          date.hour(this.fromHour24Value)
          date.minute(this.fromMin.value)
        } else {
          date.hour(this.toHour24Value)
          date.minute(this.toMin.value)
        }
      }
      return date.format(this.dataFormat)
    })
  }
  get fromDaysOfMonth() {
    return this.getDaysOfMonth('FROM')
  }
  get toDaysOfMonth() {
    return this.getDaysOfMonth('TO')
  }
  get timeHours() {
    return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  }
  get timeMinutes() {
    return [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
      '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
      '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
    ]
  }

  get fromHour24Value() {
    if (this.fromAMPM.value === 'PM') {
      const val = parseInt(this.fromHour.value) + 12
      return val === 24 ? '00' : val
    } else {
      return this.fromHour.value
    }
  }

  get toHour24Value() {
    if (this.toAMPM.value === 'PM') {
      const val = parseInt(this.toHour.value) + 12
      return val === 24 ? '00' : val
    } else {
      return this.toHour.value
    }
  }
  @ClickOutside()
  showHide(event) {
    if (event) {
      this.showPicker = !this.showPicker
      this.selectedDates = [...this.selectedDates]
      if (!this.selectedDates.length) {
        this.dateValue = null
      } else {
        this.dateValue = this.selectedDates[0]
      }
    } else {
      this.showPicker = false
    }
    if ((this.isRange && this.selectedDates.length === 1) && !this.showPicker) {
      this.selectedDates = []
      this.dateValue = null
    }
  }
  clearSelection(event) {
    event.stopPropagation()
    this.selectedDates = []
    this.fromHour.value = '01'
    this.fromMin.value = '00'
    this.fromAMPM.value = 'AM'
    this.toHour.value = '01'
    this.toMin.value = '00'
    this.toAMPM.value = 'AM'
    this.dateValue = null
  }
  selectDate(date) {
    if (!date.isDisabled) {
      let selectedDate = date._date ? moment(date._date).tz(this.timezone) : this.dateValue
      if (this.selectedDates.length == 2
        || !this.isRange
        || this.selectedDates.length === 1
        && this.selectedDates[0].isAfter(selectedDate)) {
        this.selectedDates = []
      }
      if (this.isRange) {
        this.selectedDates = [...this.selectedDates, selectedDate]
      } else {
        if (this.withTime) {
          this.selectedDates = [moment(selectedDate), moment(selectedDate)]
        } else {
          this.selectedDates = [selectedDate]
        }

      }
      if (this.withTime) {
        //this.onTimeChange()
        this.selectedDates = this.selectedDates.map((date, i) => {
          if (i === 1) {
            date.add(2, 'hour')
            this.toHour.value = date.format('hh')
            this.toMin.value = date.format('mm')
            this.toAMPM.value = date.format('A')
          } else {
            date.add(1, 'hour')
            this.fromHour.value = date.format('hh')
            this.fromMin.value = date.format('mm')
            this.fromAMPM.value = date.format('A')
          }
          return date
        })
      }
      if (!this.isRange || this.selectedDates.length === 2) {
        !this.withTime && this.showHide({})
      }
    }
  }
  onTimeChange() {
    this.selectedDates = this.selectedDates.map((date, i) => {
      if (this.withTime && this.fromMin) {
        if (i === 0) {
          date.hour(this.fromHour24Value)
          date.minute(this.fromMin.value)
        } else {
          const prevDate = this.selectedDates[0]
          if (prevDate.isSame(date) && (this.fromHour24Value > this.toHour24Value || (this.fromHour24Value === this.toHour24Value && this.fromMin < this.toMin))) {
            alert('less time')
          } else {
            date.hour(this.toHour24Value)
            date.minute(this.toMin.value)
          }
        }
      }
      return date
    })
  }
  getDaysOfMonth(type) {
    let dates = [], i, dayOfWeek, datesInMonth, date, isToday, isPast, isRanged
    let selectedItems = this.selectedDates.map(date => `${moment(date).date()}-${moment(date).month()}`)
    const firstDay = type === 'FROM' ? this.fromFirstDay : this.toFirstDay
    dayOfWeek = firstDay.day()
    datesInMonth = type === 'FROM' ? this.fromCurrentDate.daysInMonth() : this.toCurrentDate.daysInMonth()
    for (i = 0; i < datesInMonth + dayOfWeek + (7 - dayOfWeek); i++) {
      let isDisabled = false
      if (i < dayOfWeek || i >= datesInMonth + dayOfWeek) {
        dates.push({})
      } else {
        date = moment(firstDay).tz(this.timezone).add(i - dayOfWeek, 'day')
        isToday = date.isSame(this.today, 'day')
        let isActive = selectedItems.includes(`${date.date()}-${date.month()}`)
        if (this.disablePast && !isToday) {
          isDisabled = date.isBefore(this.today)
        }
        if (this.disableFuture && !isDisabled && !isToday) {
          isDisabled = date.isAfter(this.today)
        }
        if (!isDisabled && this.isRange && this.maxRange && this.selectedDates.length === 1) {
          const maxDate = moment(this.selectedDates[0]).add(this.maxRange, 'day')
          isDisabled = date.isAfter(maxDate)
        }
        if (this.isRange
          && this.hoverItem._date
          && !this.hoverItem.isDisabled
          && this.selectedDates.length === 1
        ) {
          isRanged = date.isAfter(this.selectedDates[0]) && date.isBefore(this.hoverItem._date)
        } else if (this.selectedDates.length === 2) {
          isRanged = date.isAfter(this.selectedDates[0]) && date.isBefore(this.selectedDates[1])
        }
        dates.push({
          date: date.date(),
          _date: date,
          isToday,
          isPast,
          isActive,
          isRanged,
          isDisabled
        })
      }
    }
    return dates
  }
  changeMonth(flagOrTimestamp) {
    const dateValue = moment(this.fromCurrentDate)
    if (flagOrTimestamp === 'NEXT') {
      dateValue.add(1, 'month')
    } else if (flagOrTimestamp === 'PREV') {
      dateValue.subtract(1, 'month')
    }
    this.dateValue = dateValue
  }
  hoverEffect(date) {
    this.hoverItem = date
  }
  getDateTemplate(type) {
    const daysOfMonth = type === 'FROM' ? this.fromDaysOfMonth : this.toDaysOfMonth
    return <div>
      <div class="mep-week-name">
        <span class="day" >SUN</span>
        <span class="day" >MON</span>
        <span class="day" >TUE</span>
        <span class="day" >WED</span>
        <span class="day" >THU</span>
        <span class="day" >FRI</span>
        <span class="day" >SAT</span>
      </div>
      <div class="mep-dates">
        {daysOfMonth.map(d => {
          let dateCls = ''
          if (d.date) {
            if (d.isDisabled) {
              dateCls += 'disabled'
            } else {
              dateCls += 'mx-branding-background-action important'
            }
            if (d.isToday || d.isRanged) {
              dateCls += ' mx-branding-background-light'
            }
            if (d.isActive) {
              dateCls += ' mx-branding-background'
            }
          }
          return <span
            class={dateCls}
            onClick={this.selectDate.bind(this, d)}
            onMouseOver={this.hoverEffect.bind(this, d)}
          >{d.isToday && <i />}{d.date}</span>
        })
        }
      </div>
    </div>
  }
  render() {
    return (
      <div>
        <div onClick={this.showHide.bind(this)} class={`mep-date-content ${this.withTime && 'with-time'}`}>
          {this.label && this.selectedValues.length && <label>{this.label}</label>}
          <input readOnly type="text" title={this.displayDate} value={this.displayDate} class="mx-branding-border-action" placeholder={this.placeholder} />
          <i class="clear-icon" onClick={this.clearSelection.bind(this)} />
          {this.name ?
            <input type="hidden" name={this.name} value={this.selectedValues.join(this.separator)} /> :
            <div>
              <input type="hidden" name={this.fromName} value={this.selectedValues[0]} />
              <input type="hidden" name={this.toName} value={this.selectedValues[1]} />
            </div>
          }
        </div>
        <div class={this.showPicker ? `mep-datepicker show ${this.isRange && 'is-range'}` : "mep-datepicker"} >
          <div>
            <div class="mep-current-month">
              <i class="arrow left mx-branding-border-action important" onClick={this.changeMonth.bind(this, 'PREV')} />
              <span>{this.fromMonthYearDisplay}</span>
              {
                !this.isRange && <i class="arrow right mx-branding-border-action important" onClick={this.changeMonth.bind(this, 'NEXT')} />
              }
            </div>
            {this.getDateTemplate('FROM')}
            {this.withTime &&
              <div class="time-selection">
                <div class="time">
                  <select ref={el => this.fromHour = el} onChange={this.onTimeChange.bind(this)}>
                    {
                      this.timeHours.map(t => <option value={t}>{t}</option>)
                    }
                  </select>
                  <label>:</label>
                  <select ref={el => this.fromMin = el} onChange={this.onTimeChange.bind(this)}>
                    {
                      this.timeMinutes.map(t => <option value={t}>{t}</option>)
                    }
                  </select>
                  <select ref={el => this.fromAMPM = el} onChange={this.onTimeChange.bind(this)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                {!this.isRange && <div class="time">
                  <select ref={el => this.toHour = el} onChange={this.onTimeChange.bind(this)}>
                    {
                      this.timeHours.map(t => <option value={t}>{t}</option>)
                    }
                  </select>
                  <label>:</label>
                  <select ref={el => this.toMin = el} onChange={this.onTimeChange.bind(this)}>
                    {
                      this.timeMinutes.map(t => <option value={t}>{t}</option>)
                    }
                  </select>
                  <select ref={el => this.toAMPM = el} onChange={this.onTimeChange.bind(this)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>}
                {!this.isRange && <div class="time-button">
                  <button class="btn btn-light btm-sm" onClick={this.showHide.bind(this)}>Cancel</button>
                  <button class="btn btn-primary btn-sm" onClick={this.showHide.bind(this)}>Apply</button>
                </div>}
              </div>
            }
          </div>
          {
            this.isRange && <div>
              <div class="mep-current-month">
                <span />
                <span>{this.toMonthYearDisplay}</span>
                <i class="arrow right mx-branding-border-action important" onClick={this.changeMonth.bind(this, 'NEXT')} />
              </div>
              {this.getDateTemplate('TO')}
              {this.withTime &&
                <div class="time-selection">
                  <div class="time">
                    <select ref={el => this.toHour = el} onChange={this.onTimeChange.bind(this)}>
                      {
                        this.timeHours.map(t => <option value={t}>{t}</option>)
                      }
                    </select>
                    <label>:</label>
                    <select ref={el => this.toMin = el} onChange={this.onTimeChange.bind(this)}>
                      {
                        this.timeMinutes.map(t => <option value={t}>{t}</option>)
                      }
                    </select>
                    <select ref={el => this.toAMPM = el} onChange={this.onTimeChange.bind(this)}>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <div class="time-button">
                    <button class="btn btn-light btm-sm" onClick={this.showHide.bind(this)}>Cancel</button>
                    <button class="btn btn-primary btn-sm" onClick={this.showHide.bind(this)}>Apply</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    )
  }

}
