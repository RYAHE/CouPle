import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import ValidationMessage from '../components/ValidationMessage';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessages, setValidationMessages] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    partnerEmail?: string;
  }>({});

  const { login, register, error, clearError, validatePassword, validateEmail } = useAuth();

  // Validation en temps réel
  useEffect(() => {
    const messages: typeof validationMessages = {};

    // Validation de l'email
    if (email && !validateEmail(email)) {
      messages.email = 'Adresse email invalide';
    }

    // Validation du mot de passe
    if (password && !validatePassword(password)) {
      messages.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre';
    }

    // Validation de la confirmation du mot de passe
    if (!isLogin && confirmPassword && password !== confirmPassword) {
      messages.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation du nom
    if (!isLogin && name && name.trim().length < 2) {
      messages.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation de l'email du partenaire (obligatoire)
    if (!isLogin) {
      if (!partnerEmail) {
        messages.partnerEmail = 'L\'email de votre partenaire est obligatoire';
      } else if (!validateEmail(partnerEmail)) {
        messages.partnerEmail = 'Adresse email invalide pour votre partenaire';
      }
    }

    setValidationMessages(messages);
  }, [email, password, confirmPassword, name, partnerEmail, isLogin, validateEmail, validatePassword]);

  const handleSubmit = async () => {
    // Validation des champs obligatoires
    if (!email || !password || (!isLogin && !name) || (!isLogin && !partnerEmail)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérifier s'il y a des erreurs de validation
    if (Object.keys(validationMessages).length > 0) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs de validation');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          partnerEmail: partnerEmail,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPartnerEmail('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setValidationMessages({});
    clearError();
  };

  const isFormValid = () => {
    if (isLogin) {
      return email && password && !validationMessages.email && !validationMessages.password;
    } else {
      return (
        email && 
        password && 
        name && 
        confirmPassword && 
        partnerEmail &&
        password === confirmPassword &&
        !validationMessages.email && 
        !validationMessages.password && 
        !validationMessages.name && 
        !validationMessages.confirmPassword &&
        !validationMessages.partnerEmail
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="heart" size={60} color="#FF6B9D" />
              </View>
              <Text style={styles.appName}>CouPle</Text>
              <Text style={styles.tagline}>Votre amour, organisé</Text>
            </View>
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity
              style={[styles.modeToggleButton, isLogin && styles.modeToggleButtonActive]}
              onPress={() => !isLogin && toggleAuthMode()}
            >
              <Ionicons 
                name="log-in" 
                size={20} 
                color={isLogin ? '#FF6B9D' : '#7F8C8D'} 
              />
              <Text style={[styles.modeToggleText, isLogin && styles.modeToggleTextActive]}>
                Connexion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeToggleButton, !isLogin && styles.modeToggleButtonActive]}
              onPress={() => isLogin && toggleAuthMode()}
            >
              <Ionicons 
                name="person-add" 
                size={20} 
                color={!isLogin ? '#FF6B9D' : '#7F8C8D'} 
              />
              <Text style={[styles.modeToggleText, !isLogin && styles.modeToggleTextActive]}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Reconnectez-vous à votre couple'
                : 'Commencez votre aventure ensemble'}
            </Text>

            {!isLogin && (
              <View>
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={20} color="#7F8C8D" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, validationMessages.name && styles.inputError]}
                    placeholder="Votre nom *"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                <ValidationMessage
                  type="error"
                  message={validationMessages.name || ''}
                  visible={!!validationMessages.name}
                />
              </View>
            )}

            <View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#7F8C8D" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, validationMessages.email && styles.inputError]}
                  placeholder="Adresse email *"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <ValidationMessage
                type="error"
                message={validationMessages.email || ''}
                visible={!!validationMessages.email}
              />
            </View>

            {!isLogin && (
              <View>
                <View style={styles.inputContainer}>
                  <Ionicons name="heart" size={20} color="#7F8C8D" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, validationMessages.partnerEmail && styles.inputError]}
                    placeholder="Email de votre partenaire *"
                    value={partnerEmail}
                    onChangeText={setPartnerEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <ValidationMessage
                  type="error"
                  message={validationMessages.partnerEmail || ''}
                  visible={!!validationMessages.partnerEmail}
                />
              </View>
            )}

            <View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#7F8C8D" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, validationMessages.password && styles.inputError]}
                  placeholder="Mot de passe *"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#7F8C8D"
                  />
                </TouchableOpacity>
              </View>
              {!isLogin && <PasswordStrengthIndicator password={password} />}
              <ValidationMessage
                type="error"
                message={validationMessages.password || ''}
                visible={!!validationMessages.password}
              />
            </View>

            {!isLogin && (
              <View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color="#7F8C8D" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, validationMessages.confirmPassword && styles.inputError]}
                    placeholder="Confirmer le mot de passe *"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#7F8C8D"
                    />
                  </TouchableOpacity>
                </View>
                <ValidationMessage
                  type="error"
                  message={validationMessages.confirmPassword || ''}
                  visible={!!validationMessages.confirmPassword}
                />
              </View>
            )}

            {error && (
              <ValidationMessage
                type="error"
                message={error}
                visible={true}
              />
            )}

            <TouchableOpacity
              style={[
                styles.submitButton, 
                (!isFormValid() || isLoading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Se connecter' : 'Créer un compte'}
                </Text>
              )}
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Continuer avec Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={20} color="#000000" />
              <Text style={styles.socialButtonText}>Continuer avec Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Vous n'avez pas de compte ? " : 'Vous avez déjà un compte ? '}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.footerLink}>
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              En continuant, vous acceptez nos{' '}
              <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{' '}
              <Text style={styles.termsLink}>Politique de confidentialité</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FF6B9D',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  modeToggleButtonActive: {
    backgroundColor: '#FFF5F7',
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  modeToggleTextActive: {
    color: '#FF6B9D',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 16,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  inputIcon: {
    marginRight: 12,
  },
  passwordToggle: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF6B9D',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#7F8C8D',
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  socialButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  footerLink: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
  },
  termsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  termsText: {
    color: '#7F8C8D',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#FF6B9D',
    textDecorationLine: 'underline',
  },
});

export default AuthScreen; 