/* eslint-disable @typescript-eslint/array-type */
import Loader from '@/components/loader';
import { useToast } from '@/context/ToastContext';
import { authService } from '@/services/auth.service';
import { styles } from '@/styles/verify-email.styles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Function to mask email for display
  const maskEmail = (emailAddress: string) => {
    if (!emailAddress) return 'ko************@gmail.com';
    
    const [localPart, domain] = emailAddress.split('@');
    if (!domain) return emailAddress;
    
    // Show first 2 characters of local part, then asterisks
    const visibleChars = Math.min(2, localPart.length);
    const maskedLocal = localPart.substring(0, visibleChars) + '*'.repeat(Math.max(12, localPart.length - visibleChars));
    
    return `${maskedLocal}@${domain}`;
  };

  const handleBack = () => {
    router.back();
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    // Validate code is complete
    if (verificationCode.length !== 6) {
      showError('Please enter the complete 6-digit verification code');
      return;
    }
    
    if (!email) {
      showError('Email address is missing. Please try registering again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authService.verifyEmail(email, verificationCode);
      
      if (response.success) {
        showSuccess('Email verified successfully!');
        // Small delay to show success toast before navigation
        setTimeout(() => {
          router.push('/(tabs)');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      // Handle specific error codes
      if (error.statusCode === 401) {
        showError('The verification code is invalid or has expired. Please request a new code.');
      } else if (error.statusCode === 404) {
        showError('Your account could not be found. Please try registering again.');
      } else {
        showError(error.message || 'An error occurred while verifying your email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      
      {/* Blue Background Section */}
      <View style={styles.blueSection} />
      
      {/* Back Button */}
      <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color="#FAFAFA" />
      </Pressable>

      {/* Header Text */}
      <Text style={styles.headerText}>
        Verify Your{'\n'}Email Address
      </Text>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Instructions */}
        <Text style={styles.instructionText}>
          Enter the 6 digit code sent to
        </Text>
        <Text style={styles.emailText}>{maskEmail(email || '')}</Text>

        {/* Code Input Boxes */}
        <View style={styles.codeContainer}>
          <View style={styles.codeGroup}>
            {[0, 1, 2].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.codeInput}
                value={code[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>
          
          <View style={styles.codeSeparator} />
          
          <View style={styles.codeGroup}>
            {[3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.codeInput}
                value={code[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Verify Button - Fixed at Bottom */}
      <Pressable 
        style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]} 
        onPress={handleVerify}
        disabled={isLoading}
      >
        <Text style={styles.verifyButtonText}>Verify Email Address</Text>
      </Pressable>
      
      {/* Full Screen Loader Overlay */}
      {isLoading && <Loader />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
