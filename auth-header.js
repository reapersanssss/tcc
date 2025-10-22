// auth-header.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://jwmbpltpmpkqczxdoave.supabase.co'    // <<-- troque
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bWJwbHRwbXBrcWN6eGRvYXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTEwNDcsImV4cCI6MjA3NDE2NzA0N30.fOIG41NcI5lpop34eg-TsymepReu2PHysu_ESkU5m_Q'             // <<-- troque
const BUCKET_NAME = 'avatars'                             // <<-- troque caso necessário

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', userId)
    .single()
  if (error) {
    console.warn('Não encontrou profile:', error.message)
    return null
  }
  return data
}

function createUserMenu(name, avatarUrl) {
  const nav = document.getElementById('navLinks')
  if (!nav) return

  // remover link "Entrar" se existir
  const loginLink = document.getElementById('loginLink')
  if (loginLink && loginLink.parentElement) {
    loginLink.parentElement.remove()
  }

  // criar item com avatar e nome
  const li = document.createElement('li')
  li.style.display = 'flex'
  li.style.alignItems = 'center'
  li.style.gap = '10px'

  const img = document.createElement('img')
  img.src = avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=00ffc3&color=000'
  img.alt = name
  img.style.width = '36px'
  img.style.height = '36px'
  img.style.borderRadius = '50%'
  img.style.objectFit = 'cover'
  img.style.border = '2px solid var(--primaria)'

  const span = document.createElement('span')
  span.textContent = name
  span.style.color = 'var(--primaria)'
  span.style.fontWeight = '700'

  // menu dropdown simples com "Sair"
  const dropdown = document.createElement('div')
  dropdown.style.position = 'relative'

  const button = document.createElement('button')
  button.textContent = ''
  button.style.background = 'transparent'
  button.style.border = 'none'
  button.style.display = 'flex'
  button.style.alignItems = 'center'
  button.style.gap = '10px'
  button.appendChild(img)
  button.appendChild(span)
  button.style.cursor = 'pointer'

  const menu = document.createElement('div')
  menu.style.position = 'absolute'
  menu.style.right = '0'
  menu.style.top = '46px'
  menu.style.background = 'var(--bg-secundario)'
  menu.style.border = '1px solid rgba(255,255,255,0.04)'
  menu.style.padding = '8px'
  menu.style.borderRadius = '8px'
  menu.style.display = 'none'
  menu.style.boxShadow = '0 6px 18px rgba(0,0,0,0.6)'

  const logout = document.createElement('a')
  logout.href = '#'
  logout.textContent = 'Sair'
  logout.style.display = 'block'
  logout.style.padding = '6px 10px'
  logout.style.color = 'var(--texto)'
  logout.style.textDecoration = 'none'
  logout.addEventListener('click', async (e) => {
    e.preventDefault()
    await supabase.auth.signOut()
    localStorage.removeItem('supabaseSession')
    window.location.href = 'login.html'
  })

  menu.appendChild(logout)

  button.addEventListener('click', () => {
    menu.style.display = (menu.style.display === 'none') ? 'block' : 'none'
  })

  dropdown.appendChild(button)
  dropdown.appendChild(menu)

  li.appendChild(dropdown)
  nav.appendChild(li)
}

// Verifica sessão ao carregar
async function initAuthHeader() {
  // tenta obter sessão do localStorage
  let session = null
  try {
    session = JSON.parse(localStorage.getItem('supabaseSession'))
  } catch (e) { session = null }

  // se não há sessão local, pede ao supabase
  if (!session) {
    const { data } = await supabase.auth.getSession()
    session = data.session || null
    if (session) localStorage.setItem('supabaseSession', JSON.stringify(session))
  }

  if (session && session.user) {
    const user = session.user
    // pega profile
    const profile = await getProfile(user.id)
    const displayName = (profile && profile.full_name) ? profile.full_name : (user.user_metadata?.full_name || (user.email || 'Usuário'))
    const avatar = (profile && profile.avatar_url) ? profile.avatar_url : null
    createUserMenu(displayName, avatar)
  }
}

initAuthHeader()
