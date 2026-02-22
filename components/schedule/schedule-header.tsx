import { styles } from '@/styles/schedule-header.styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Image, Modal, Platform, Pressable, Text, View } from 'react-native';

type ScheduleHeaderProps = {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  channelName?: string;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function ScheduleHeader({
  selectedDate,
  onDateChange,
  channelName,
}: ScheduleHeaderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(currentDate);

  const today = useMemo(() => startOfDay(new Date()), []);

  const isOnToday = isSameDay(currentDate, today);

  const formatDateLabel = (date: Date) => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    if (isSameDay(date, todayStart)) {
      return 'Today';
    }
    if (isSameDay(date, tomorrowStart)) {
      return 'Tomorrow';
    }

    // Check if within next week (2-6 days from now)
    const diffDays = Math.round(
      (startOfDay(date).getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays >= 2 && diffDays <= 6) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }

    // Beyond this week
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    if (startOfDay(newDate) < today) return;
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleToday = () => {
    const todayDate = new Date();
    setCurrentDate(todayDate);
    onDateChange?.(todayDate);
  };

  const handlePickDate = () => {
    setTempDate(currentDate);
    setShowDatePicker(true);
  };

  const handleDatePickerChange = (event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && selected) {
        const safeDate = startOfDay(selected) < today ? new Date() : selected;
        setCurrentDate(safeDate);
        onDateChange?.(safeDate);
      }
    } else if (selected) {
      setTempDate(selected);
    }
  };

  const handleIOSConfirm = () => {
    setShowDatePicker(false);
    const safeDate = startOfDay(tempDate) < today ? new Date() : tempDate;
    setCurrentDate(safeDate);
    onDateChange?.(safeDate);
  };

  const handleIOSCancel = () => {
    setShowDatePicker(false);
    setTempDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>
        {channelName ? `${channelName} Schedule` : 'Schedule'}
      </Text>

      {/* Date Navigation Row: arrows + label centered */}
      <View style={styles.dateNavRow}>
        <Pressable
          style={[styles.arrowButton, isOnToday && styles.arrowButtonDisabled]}
          onPress={handlePreviousDay}
          disabled={isOnToday}
        >
          <Image
            source={require('@/assets/Icons/dropdown.png')}
            style={[
              styles.arrowIcon,
              styles.leftArrow,
              isOnToday && styles.arrowIconDisabled,
            ]}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable style={styles.dateLabelButton} onPress={handleToday}>
          <Text style={styles.dateLabelText} numberOfLines={1}>
            {formatDateLabel(currentDate)}
          </Text>
        </Pressable>

        <Pressable style={styles.arrowButton} onPress={handleNextDay}>
          <Image
            source={require('@/assets/Icons/dropdown.png')}
            style={[styles.arrowIcon, styles.rightArrow]}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Pick a Date — fixed position below */}
      <Pressable style={styles.pickDateButton} onPress={handlePickDate}>
        <Image
          source={require('@/assets/Icons/Calender.png')}
          style={styles.calendarIcon}
          resizeMode="contain"
        />
        <Text style={styles.pickDateText}>Pick a date</Text>
      </Pressable>

      {/* Date Picker Modal for iOS */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleIOSCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Pressable onPress={handleIOSCancel}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </Pressable>
                <Text style={styles.modalTitle}>Select Date</Text>
                <Pressable onPress={handleIOSConfirm}>
                  <Text style={[styles.modalButton, styles.modalButtonPrimary]}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                minimumDate={today}
                onChange={handleDatePickerChange}
                textColor="#000000"
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker for Android */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          minimumDate={today}
          onChange={handleDatePickerChange}
        />
      )}
    </View>
  );
}
