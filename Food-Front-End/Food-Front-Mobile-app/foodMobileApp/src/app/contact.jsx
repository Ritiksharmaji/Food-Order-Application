import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AppInput from '../components/AppInput'
import { useStore } from '../context/StoreContext'
import { BRAND, FONT, getColors } from '../theme/theme'

const info = [
  { icon: '📍', title: 'Visit us', lines: ['123 Flavour Street', 'Foodie Town, 400001'] },
  { icon: '📞', title: 'Call us', lines: ['+91 98765 43210', 'Mon–Sun, 9am–11pm'] },
  { icon: '✉️', title: 'Email us', lines: ['support@tomato.com', 'orders@tomato.com'] },
  { icon: '⏰', title: 'Hours', lines: ['Mon–Fri: 9am – 11pm', 'Sat–Sun: 10am – 12am'] },
]

const Contact = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme, toast } = useStore()
  const colors = getColors(theme)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const submit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast('Please fill in your name, email and message', 'error')
      return
    }
    toast("Thanks for reaching out! We'll get back to you soon.")
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Contact</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        >
          <View style={[styles.tag, { backgroundColor: colors.tint }]}>
            <Text style={styles.tagText}>Get in touch</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>We'd love to hear from you</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>
            Questions, feedback or just craving a chat about food? Drop us a message.
          </Text>

          {/* Info cards */}
          <View style={styles.infoGrid}>
            {info.map((c) => (
              <View
                key={c.title}
                style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={{ fontSize: 24 }}>{c.icon}</Text>
                <Text style={[styles.infoTitle, { color: colors.text }]}>{c.title}</Text>
                {c.lines.map((l) => (
                  <Text key={l} style={[styles.infoLine, { color: colors.muted }]}>
                    {l}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          {/* Form */}
          <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Send us a message</Text>
            <AppInput
              icon="person-outline"
              placeholder="Your name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />
            <AppInput
              icon="mail-outline"
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />
            <AppInput
              icon="chatbox-outline"
              placeholder="Subject"
              value={form.subject}
              onChangeText={(t) => setForm({ ...form, subject: t })}
            />
            <TextInput
              placeholder="Your message"
              placeholderTextColor={colors.muted}
              value={form.message}
              onChangeText={(t) => setForm({ ...form, message: t })}
              multiline
              style={[
                styles.textarea,
                { color: colors.text, backgroundColor: colors.input, borderColor: colors.border },
              ]}
            />
            <TouchableOpacity style={styles.submit} onPress={submit} activeOpacity={0.9}>
              <Text style={styles.submitText}>Send message</Text>
            </TouchableOpacity>
          </View>

          {/* Map placeholder — same as web */}
          <View style={[styles.map, { backgroundColor: colors.tint }]}>
            <Text style={{ fontSize: 36 }}>🗺️</Text>
            <Text style={[styles.mapText, { color: colors.text }]}>123 Flavour Street, Foodie Town</Text>
            <Text style={[styles.mapSmall, { color: colors.muted }]}>Open in Maps</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: FONT.semibold },
  tag: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  tagText: { color: BRAND, fontSize: 12.5, fontFamily: FONT.semibold },
  title: { fontSize: 26, fontFamily: FONT.bold, marginTop: 12 },
  sub: { fontSize: 13.5, fontFamily: FONT.regular, marginTop: 6, lineHeight: 20 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 18 },
  infoCard: {
    width: '47.8%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 3,
  },
  infoTitle: { fontSize: 14.5, fontFamily: FONT.semibold, marginTop: 4 },
  infoLine: { fontSize: 12, fontFamily: FONT.regular },
  form: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 12, marginTop: 20 },
  formTitle: { fontSize: 18, fontFamily: FONT.semibold, marginBottom: 2 },
  textarea: {
    borderRadius: 14,
    borderWidth: 1.4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 110,
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: FONT.regular,
  },
  submit: {
    backgroundColor: BRAND,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { color: '#fff', fontSize: 15, fontFamily: FONT.semibold },
  map: {
    borderRadius: 18,
    padding: 26,
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  mapText: { fontSize: 14, fontFamily: FONT.medium },
  mapSmall: { fontSize: 12, fontFamily: FONT.regular },
})

export default Contact
