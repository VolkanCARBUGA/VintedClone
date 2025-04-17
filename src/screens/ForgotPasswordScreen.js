import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/api';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await authService.forgotPassword(email);
      
      setSuccess(true);
      
      // Show success message
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Şifre sıfırlama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Şifremi Unuttum</Text>
      </View>

      <View style={styles.formContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? (
          <Text style={styles.successText}>
            Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.
          </Text>
        ) : (
          <>
            <Text style={styles.instructionText}>
              Lütfen hesabınızla ilişkili e-posta adresini girin. Şifrenizi sıfırlamak için bir bağlantı göndereceğiz.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="E-posta adresiniz"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <TouchableOpacity 
              style={[
                styles.resetButton, 
                (!email || loading) ? styles.resetButtonDisabled : null
              ]} 
              onPress={handleResetPassword}
              disabled={!email || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.resetButtonText}>SIFIRLAMA BAĞLANTISI GÖNDER</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#00C3A5',
    marginRight: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  errorText: {
    color: '#FF5252',
    marginBottom: 15,
    textAlign: 'center',
  },
  successText: {
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#00C3A5',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
