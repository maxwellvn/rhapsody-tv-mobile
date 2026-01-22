import { styles } from '@/styles/schedule-header.styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Image, Modal, Platform, Pressable, Text, View } from 'react-native';

type ScheduleHeaderProps = {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
};

export function ScheduleHeader({ selectedDate, onDateChange }: ScheduleHeaderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(currentDate);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
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
    const today = new Date();
    setCurrentDate(today);
    onDateChange?.(today);
  };

  const handlePickDate = () => {
    setTempDate(currentDate);
    setShowDatePicker(true);
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && selectedDate) {
        setCurrentDate(selectedDate);
        onDateChange?.(selectedDate);
      }
    } else if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleIOSConfirm = () => {
    setShowDatePicker(false);
    setCurrentDate(tempDate);
    onDateChange?.(tempDate);
  };

  const handleIOSCancel = () => {
    setShowDatePicker(false);
    setTempDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Rhapsody TV Schedule</Text>
      
      {/* Current Date */}
      <Text style={styles.dateText}>{formatDate(currentDate)}</Text>

      {/* Navigation Row */}
      <View style={styles.navigationRow}>
        {/* Previous Day Button */}
        <Pressable style={styles.arrowButton} onPress={handlePreviousDay}>
          <Image
            source={require('@/assets/Icons/dropdown.png')}
            style={[styles.arrowIcon, styles.leftArrow]}
            resizeMode="contain"
          />
        </Pressable>

        {/* Today Button */}
        <Pressable 
          style={styles.todayButton} 
          onPress={handleToday}
        >
          <Text style={styles.todayText}>Today</Text>
        </Pressable>

        {/* Next Day Button */}
        <Pressable style={styles.arrowButton} onPress={handleNextDay}>
          <Image
            source={require('@/assets/Icons/dropdown.png')}
            style={[styles.arrowIcon, styles.rightArrow]}
            resizeMode="contain"
          />
        </Pressable>

        {/* Pick a Date Button */}
        <Pressable style={styles.pickDateButton} onPress={handlePickDate}>
          <Image
            source={require('@/assets/Icons/Calender.png')}
            style={styles.calendarIcon}
            resizeMode="contain"
          />
          <Text style={styles.pickDateText}>Pick a date</Text>
        </Pressable>
      </View>

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
          onChange={handleDatePickerChange}
        />
      )}
    </View>
  );
}
