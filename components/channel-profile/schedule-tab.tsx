import { ScheduleHeader } from '@/components/schedule/schedule-header';
import { ScheduleProgramCard } from '@/components/schedule/schedule-program-card';
import { StyleSheet, View } from 'react-native';

export function ScheduleTab() {
  const handleDateChange = (date: Date) => {
    console.log('Date changed:', date);
  };

  const handleWatchNow = (title: string) => {
    console.log('Watch now pressed:', title);
  };

  return (
    <View style={styles.container}>
      {/* Schedule Header */}
      <ScheduleHeader onDateChange={handleDateChange} />

      {/* Schedule Programs */}
      <ScheduleProgramCard
        time="2:00 PM"
        duration="1 hrs"
        category="NEWS"
        title="RHAPATHON 2023 HIGHLIGHTS"
        description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
        hostCount={3}
        watchingCount="645"
        isLive={true}
        onWatchNowPress={() => handleWatchNow('RHAPATHON 2023 HIGHLIGHTS')}
      />

      <ScheduleProgramCard
        time="3:00 PM"
        duration="1 hrs"
        category="NEWS"
        title="RHAPATHON 2023 HIGHLIGHTS"
        description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
        hostCount={3}
        watchingCount="100"
        isLive={false}
        onWatchNowPress={() => handleWatchNow('RHAPATHON 2023 HIGHLIGHTS')}
      />

      <ScheduleProgramCard
        time="4:00 PM"
        duration="1 hrs"
        category="NEWS"
        title="RHAPATHON 2023 HIGHLIGHTS"
        description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
        hostCount={3}
        watchingCount="100"
        isLive={false}
        onWatchNowPress={() => handleWatchNow('RHAPATHON 2023 HIGHLIGHTS')}
      />

      <ScheduleProgramCard
        time="5:00 PM"
        duration="1 hrs"
        category="NEWS"
        title="RHAPATHON 2023 HIGHLIGHTS"
        description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
        hostCount={3}
        watchingCount="100"
        isLive={false}
        onWatchNowPress={() => handleWatchNow('RHAPATHON 2023 HIGHLIGHTS')}
      />

      <ScheduleProgramCard
        time="6:00 PM"
        duration="1 hrs"
        category="NEWS"
        title="RHAPATHON 2023 HIGHLIGHTS"
        description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
        hostCount={3}
        watchingCount="100"
        isLive={false}
        onWatchNowPress={() => handleWatchNow('RHAPATHON 2023 HIGHLIGHTS')}
      />

      <ScheduleProgramCard
        time="7:00 PM"
        duration="1 hrs"
        category="NEWS"
        title="RHAPATHON 2023 HIGHLIGHTS"
        description="Tune in for exclusive highlight content from the previous Rhapathon 2023 with Pastor Chris"
        hostCount={3}
        watchingCount="100"
        isLive={false}
        onWatchNowPress={() => handleWatchNow('RHAPATHON 2023 HIGHLIGHTS')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
