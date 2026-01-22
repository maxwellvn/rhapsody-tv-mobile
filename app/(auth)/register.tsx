import { AuthTabs } from '@/components/auth-tabs';
import Loader from '@/components/loader';
import { useToast } from '@/context/ToastContext';
import { styles } from '@/styles/register.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      showError('Please enter your full name');
      return false;
    }
    
    if (!email.trim()) {
      showError('Please enter your email address');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      showError('Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    // Commented out for testing - navigate directly to homepage
    // if (!validateForm()) {
    //   return;
    // }
    
    // setIsLoading(true);
    
    // try {
    //   const userEmail = email.trim().toLowerCase();
      
    //   // Step 1: Register user
    //   const response = await authService.register({
    //     fullName: fullName.trim(),
    //     email: userEmail,
    //     password,
    //   });
      
    //   if (response.success) {
    //     // Save tokens to storage
    //     await storage.saveTokens(
    //       response.data.accessToken,
    //       response.data.refreshToken
    //     );
        
    //     // Save user data
    //     await storage.saveUserData(response.data.user);
        
    //     // Navigate directly to home page (bypassing email verification for testing)
    //     router.replace('/(tabs)');
        
    //     showSuccess(response.message || 'Registration successful!');
    //   }
    // } catch (error: any) {
    //   console.error('Registration error:', error);
    //   showError(error.message || 'An error occurred during registration. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }

    // Navigate directly to homepage regardless of any validation or API calls
    router.replace('/(tabs)');
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
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color="#FAFAFA" />
        </Pressable>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>
          Welcome to{'\n'}Rhapsody TV
        </Text>

        {/* Auth Tabs */}
        <View style={styles.tabsContainer}>
          <AuthTabs activeTab="register" />
        </View>

        {/* Form Container */}
        <ScrollView 
          style={styles.formContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, focusedField === 'fullName' && styles.inputFocused]}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setFocusedField('fullName')}
            onBlur={() => setFocusedField(null)}
            autoCorrect={false}
            editable={!isLoading}
          />

          {/* Email Address */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, focusedField === 'email' && styles.inputFocused]}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            editable={!isLoading}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordContainer, focusedField === 'password' && styles.passwordContainerFocused]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              editable={!isLoading}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              hitSlop={8}
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#999"
              />
            </Pressable>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[styles.passwordContainer, focusedField === 'confirmPassword' && styles.passwordContainerFocused]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              editable={!isLoading}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              hitSlop={8}
              disabled={isLoading}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#999"
              />
            </Pressable>
          </View>

          {/* Register Button */}
          <Pressable 
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>
          
          {/* Full Screen Loader Overlay */}
          {isLoading && <Loader />}

          {/* OR Divider */}
          <Text style={styles.orText}>OR</Text>

          {/* KingsChat Button */}
          <Pressable style={styles.kingschatButton}>
            <Text style={styles.kingschatButtonText}>Sign In with KingsChat</Text>
            <Image
              source={require('@/assets/Icons/KC.png')}
              style={styles.kingschatIcon}
              resizeMode="contain"
            />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
